const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  InterviewControler,
  submitanswer,
  getscore,
} = require("../controlers/InterviewControler");

router.post("/startinterview", authMiddleware, InterviewControler);
router.post("/submitanswer", authMiddleware, submitanswer);
router.post("/getscore", authMiddleware, getscore);

module.exports = router;
