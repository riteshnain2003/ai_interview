import { configureStore } from "@reduxjs/toolkit";
import interviewreducer from "./slices/Session_Slice";
import authreducer from "./slices/Auth_Slice";

export const store = configureStore({
  reducer: {
    Interview: interviewreducer,
    Auth: authreducer,
  },
});
