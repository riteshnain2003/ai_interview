import { createSlice } from '@reduxjs/toolkit';
const initialState={
    sessionid:null,
    question:null,
    questionno:1,
    report:null,

}

const sessionSlice=createSlice({
    name:"Interview",
    initialState,
    reducers:{
        setquestion:(state,action)=>{
            state.question=action.payload;
        },
        setsessionid:(state,action)=>{
            state.sessionid=action.payload
        },
        setquestionno:(state,action)=>{
            state.questionno=action.payload
        },
        setreport:(state,action)=>{
            state.report=action.payload
        }

    }
})

export const {setquestion,setsessionid,setquestionno,setreport}=sessionSlice.actions

export default sessionSlice.reducer;