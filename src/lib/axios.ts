import Axios, { AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { parse } from "qs";
import qs from "qs";
import toast from "react-hot-toast";

const axios = Axios.create({
  timeout: 30000,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  paramsSerializer: {
    encode: parse as any,
    serialize: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
  },
});

const NO_TOAST_ENDPOINT_LIST = [""];

axios.interceptors.request.use(
  async (config) => {
    if (!config.headers['Authorization']) {
      const session = await getSession()
      config.headers['Authorization'] = `Bearer ${session?.user.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let message =
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      error.message;
    const session = await getSession();
    if (error?.response?.data?.status === 401) {
      if (session) await signOut({ callbackUrl: "/sign_in" });
      if (!error?.response?.data?.detail) message = "再認証が必要です";
    }
    const match = NO_TOAST_ENDPOINT_LIST.find((endpoint) =>
      error.request.responseURL.includes(endpoint)
    );
    if (!match) toast.error(message);
    return Promise.reject(error);
  }
);

export default axios;
