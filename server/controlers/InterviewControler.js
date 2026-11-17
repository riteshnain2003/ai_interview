const Turn=require("../modals/Turn")
const InterviewSession=require("../modals/Interview")
const { PDFParse } = require("pdf-parse");
const {uploadtocloudinary}=require("../utils/UploadCloudinary")
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const fs = require('fs').promises;


const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



exports.InterviewControler=async(req,res)=>{
    try{
    
      console.log("in interviewcontroler")
      const{candidateName,targetRole,seniority,skills,difficulty,persona,jobDescription}=req.body;
        // console.log("type of skills",typeof skills)
        // console.log("yha hai skills",skills)
        // const parsedskills=typeof skills=="string"? JSON.parse(skills):skills;

        // Safe parsing for skills whether sent as array, JSON string, or plain string
        let parsedskills = skills;
        if (typeof skills === "string") {
            try {
                parsedskills = JSON.parse(skills);
            } catch (e) {
                parsedskills = skills.split(",").map(s => s.trim());
            }
        }
        if (!Array.isArray(parsedskills)) {
            parsedskills = [parsedskills];
        }
        

        let resumeText='';
        let resumeUrl=null;

        // 1. Process Resume if provided via express-fileupload
        if (req.files && req.files.resume)
            
    {
      const resumeFile = req.files.resume;

       // Validate MIME type
      if (resumeFile.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, message: 'Only PDF resumes are supported' });
      }

      let pdfdata;
    try {
        // 1. Read the file buffer from the temp file path
        pdfdata = await fs.readFile(resumeFile.tempFilePath);

        // Check if the read buffer is empty
        if (!pdfdata || pdfdata.length === 0) {
            return res.status(400).json({ success: false, message: 'Uploaded PDF file is empty or corrupted' });
        }

        // 2. Initialize parser with the actual 'pdfdata' buffer (NOT resumeFile.data)
        const parser = new PDFParse({ data: pdfdata });
        try {
            const parsedPdf = await parser.getText();
            resumeText = parsedPdf.text || '';
        } finally {
            await parser.destroy(); // Release memory resources
        }

        // 3. Upload to Cloudinary using the 'pdfdata' buffer
        const result = await uploadtocloudinary(resumeFile.tempFilePath, "resumes");
        resumeUrl = typeof result === "string" ? result : result?.secure_url || null;
        console.log("resumeurl", resumeUrl);

    } finally {
        // 4. Clean up: Delete the temporary file from your /tmp folder to save disk space if still present
        try {
            await fs.unlink(resumeFile.tempFilePath);
        } catch (cleanupErr) {
            // File might have already been removed by uploadtocloudinary
        }
    }

      // //parsed pdf text
      
      // const parsedPdf = await pdfParse(resumeFile.data);
      // // const parsedPdf=await pdfParse(resumeFile.data);
      // resumeText=parsedPdf.text || '';

      // const result=await uploadtocloudinary(resumeFile.data,"resumes")
      // resumeUrl=result.secure_url;
    } 

    // prompt for ai

const systemPrompt = `
You are an expert AI Technical Interviewer acting as a "${persona || 'Strict Tech Lead'}".
Candidate Information:
- Target Role: ${targetRole || 'Full-Stack Developer'}
- Seniority Level: ${seniority}
- Target Skills: ${parsedskills.join(', ')}
- Question Difficulty: ${difficulty}
- Resume Highlights: ${resumeText ? resumeText.substring(0, 2000) : 'None provided'}
- Job Description: ${jobDescription || 'None provided'}

Guidelines:
1. Ask only ONE question at a time.
2. Formulate your first question to test real-world problem-solving based on their skills and resume.
3. Be professional, direct, and conversational. Output only the spoken question without any markdown tags or prefixes.
`;

const geminiresponse= await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt },
          { role: "user", content: "start the interview and Ask me first question" },],
        model: "openai/gpt-oss-20b",});

 

console.log("yha gemini ka response",geminiresponse)


const firstQuestion = geminiresponse.choices[0]?.message?.content?.trim();

console.log("first question",firstQuestion)
// 
// 4. Create the InterviewSession in MongoDB
    const session = await InterviewSession.create({
      candidateName: candidateName || req.user?.name || 'Candidate',
      userId: req.user?.id || null,
      targetRole: targetRole || 'Full-Stack Developer',
      seniority,
      skills: parsedskills,
      difficulty,
      persona: persona || 'Strict Tech Lead',
      resumeText: resumeText.substring(0, 3000),
      jobDescription: jobDescription || '',
      resumeUrl, // Permanent Cloudinary link
      turns: [],
      status: 'in-progress',
    });

// 5. Create Turn #1 (AI Question) and link to session
    const firstTurn = await Turn.create({
      sessionId: session._id,
      role: 'ai',
      content: firstQuestion,
      
    });

    session.turns.push(firstTurn._id);
    await session.save();

    res.status(201).json({
      success: true,
      sessionId: session._id,
      firstQuestion,
      resumeUrl,
    });

}
    catch(error){
    console.error('Error in startInterview controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: error.message,
    });

    }

}

exports.submitanswer = async (req, res) => {
    try {
        console.log("in sumitanswer contoler");
        console.log(req.body);
        const { answer, sessionid} = req.body;
        console.log("anser", answer);
        console.log("session id", sessionid);
        
        if (!answer || !sessionid) {
            return res.status(400).json({
                success: false,
                message: "required all fields"
            });
        }

        // find the session and populate the turn
        const session = await InterviewSession.findById(sessionid).populate("turns");
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "session not found"
            });
        }

        // Count previous candidate turns + 1 for current answer
        const candidateTurnCount = session.turns.filter((t) => t && t.role === "candidate").length + 1;
        const max_count = 5;

        // Map populated turns to Groq conversation history
        const conversation_history = session.turns
            .filter((t) => t && t.role && t.content)
            .map((t) => ({
                role: t.role === "ai" ? "assistant" : "user",
                content: t.content
            }));

        // Add the current candidate's answer to conversation history
        conversation_history.push({
            role: "user",
            content: answer.trim()
        });

        // Add new answer turn to DB
        const candidateTurn = await Turn.create({
            sessionId: session._id,
            role: 'candidate',
            content: answer.trim(),
         // 'voice' or 'text'
        });

        session.turns.push(candidateTurn._id);

        if (candidateTurnCount >= max_count) {
            session.status = 'completed';
            await session.save();
            return res.status(200).json({
                success: true,
                isCompleted: true,
                message: "interview finished ! generate Score...."
            });
        }

        const followupPrompt = `
You are conducting a technical interview acting as a "${session.persona || 'Strict Tech Lead'}".
Target Role: ${session.targetRole || 'Full-Stack Developer'} (${session.seniority || 'Mid-Level'})
Difficulty: ${session.difficulty || 'Medium'}
Core Skills: ${Array.isArray(session.skills) ? session.skills.join(', ') : session.skills || 'Not specified'}

Guidelines:
1. Review the candidate's latest answer in context of the conversation.
2. If the answer is vague or inaccurate, ask a brief follow-up or challenge them.
3. If the answer is complete, move to the next topic.
4. Ask only ONE question at a time.
5. Keep your tone direct and conversational. Do NOT output headings, asterisks, or evaluation notes—just speak the next question.
`;

        const groqresponse = await groq.chat.completions.create({
            messages: [
                { role: "system", content: followupPrompt },
                ...conversation_history
            ],
            model: "openai/gpt-oss-20b",
        });

        console.log("groq response in submitanswer:", groqresponse);

        const nextQuestion = groqresponse.choices[0]?.message?.content?.trim();
        console.log("next question yha hai",nextQuestion)

        // store ai response turn 
        const aiturn = await Turn.create({
            sessionId: sessionid,
            role: "ai",
            content: nextQuestion
        });

        session.turns.push(aiturn._id);
        await session.save();

        return res.status(200).json({
            success: true,
            isCompleted: false,
            nextQuestion,
            turnid: aiturn._id,
            question_no: candidateTurnCount + 1
        });

    } catch (error) {
        console.error('Error in submit answer controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit answer interview',
            error: error.message,
        });
    }
};

exports.getscore = async (req, res) => {
    try {
        console.log("in get score")
        console.log(req.body)
        const { sessionid } = req.body;
        if (!sessionid) {
            return res.status(400).json({
                success: false,
                message: "required all fields"
            });
        }

        // find the session and populate the turn
        const session = await InterviewSession.findById(sessionid).populate("turns");
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "session not found"
            });
        }

        const conversation_history = session.turns
            .filter((t) => t && t.role && t.content)
            .map((t) => ({
                role: t.role === "ai" ? "interviewer" : "candidate",
                text: t.content
            }));

        const prompt = `
Analyze the following interview transcript and evaluate the candidate. 
Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": number (out of 10),
  "summary": "string overview of performance",
  "strengths": ["string"],
  "areasForImprovement": ["string"],
  "breakdown": [
    { "question": "string", "score": number, "feedback": "string" }
  ]
}
Transcript: ${JSON.stringify(conversation_history)}
`;

        const groqresponse = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            model: "openai/gpt-oss-20b",
        });

        console.log("groq response in getscore:", groqresponse);

        const evaluationReport = JSON.parse(groqresponse.choices[0]?.message?.content || '{}');

        session.reports.push({
            overallScore: evaluationReport.overallScore,
            summary: evaluationReport.summary,
            strengths: evaluationReport.strengths,
            areasForImprovement: evaluationReport.areasForImprovement,
            breakdown: evaluationReport.breakdown,
            createdAt: new Date()
        });

        session.overallScore = evaluationReport.overallScore;
        session.status = 'completed';

        // Save the parent document to commit the changes to MongoDB
        await session.save();

        return res.status(200).json({
            success: true,
            report: evaluationReport
        });

    } catch (error) {
        console.error("Error during generate score:", error);
        return res.status(500).json({
            success: false,
            message: "error during generate score",
            error: error.message
        });
    }
};
