import axios from "../../../utils/AxiosInstance";
import { loginStart, loginSuccess, loginFailure } from "./authSlice";

export const loginUser = (loginData) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const response = await axios.post("/auth/login", loginData);

    const { token, ...user } = response.data;

    dispatch(loginSuccess({ user, token }));

    localStorage.setItem(   
      "attendx_user",
      JSON.stringify({ user, token })
    );

    return { success: true };

  } catch (error) {
    const message =
      error.response?.data?.message || "Login Failed";

    dispatch(loginFailure(message));

    return { success: false, message };
  }
};
