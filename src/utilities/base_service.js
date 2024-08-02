import axios from "axios";
import { toast } from "react-toastify";
// import store from "../store";
// import { logOutSuccess } from "@/store/auth/actions";
import { SERVER_ORIGIN, vars, validation } from "../../utilities/constants";


const unauthorizedCode = [401];

const BaseUrl = "";

const AxiosInstance = axios.create({
    timeout: 60000,
    baseURL: BaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

AxiosInstance.interceptors.request.use(
    (config) => {
        // const accessToken = "jgklajsgka";
        const accessToken = sessionStorage.getItem("token")
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        toast.error(response?.data?.message || "Server error");
        if (response && unauthorizedCode.includes(response?.status)) {
            // store.dispatch(logOutSuccess());
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;
