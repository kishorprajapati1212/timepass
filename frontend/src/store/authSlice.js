import { createSlice } from "@reduxjs/toolkit";
const getInitialState = () => {
  try { const stored = localStorage.getItem("attendx_user"); if (stored) { const parsed = JSON.parse(stored); return { isAuthenticated: true, user: parsed.user || null, token: parsed.token || null }; } } catch (e) { localStorage.removeItem("attendx_user"); }
  return { isAuthenticated: false, user: null, token: null };
};
const authSlice = createSlice({
  name: "auth", initialState: getInitialState(),
  reducers: {
    login: (state, action) => { state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; localStorage.setItem("attendx_user", JSON.stringify(action.payload)); },
    logout: (state) => { state.isAuthenticated = false; state.user = null; state.token = null; localStorage.removeItem("attendx_user"); },
    updateUser: (state, action) => { state.user = { ...state.user, ...action.payload }; const stored = JSON.parse(localStorage.getItem("attendx_user") || "{}"); stored.user = state.user; localStorage.setItem("attendx_user", JSON.stringify(stored)); }
  }
});
export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
