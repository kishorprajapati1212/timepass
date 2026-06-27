import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://3000-firebase-impacthon-1768648789549.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const data = localStorage.getItem("attendx_user");

    if (data) {
      const { token } = JSON.parse(data);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;