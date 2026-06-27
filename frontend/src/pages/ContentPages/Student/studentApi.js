import axios from "../../../utils/AxiosInstance";

export const markAttendance = async (data) => {
  return axios.post("/attendance/mark", data);
};