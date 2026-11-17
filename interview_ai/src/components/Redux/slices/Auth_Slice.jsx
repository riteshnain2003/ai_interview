import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem("token") || null;
let user = null;
try {
  const savedUser = localStorage.getItem("user");
  user = savedUser ? JSON.parse(savedUser) : null;
} catch (e) {
  user = null;
}

const initialState = {
  token,
  user,
  isAuthenticated: Boolean(token),
  loading: false,
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("interviewReport");
    },
  },
});

export const { setLoading, setLoginSuccess, setUser, setLogout } = authSlice.actions;
export default authSlice.reducer;
