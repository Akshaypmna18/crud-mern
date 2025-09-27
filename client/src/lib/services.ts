import axios, { AxiosResponse } from "axios";
import { API_URL } from "./utils";
import { RequestType, Params, ApiResponse } from "./servicesTypes";

export const commonAPI = async <T = unknown>(
  endpoint: string = "",
  reqType: RequestType = "GET",
  params: Params = {}
): Promise<AxiosResponse<ApiResponse<T>>> => {
  const url = `${API_URL}/${endpoint}`;
  const config = {
    timeout: 7500,
    retry: 1,
  };

  switch (reqType) {
    case "POST":
      return await axios.post<ApiResponse<T>>(url, params, config);
    case "PUT":
      return await axios.put<ApiResponse<T>>(url, params, config);
    case "DELETE":
      return await axios.delete<ApiResponse<T>>(url, config);
    default:
      return await axios.get<ApiResponse<T>>(url, config);
  }
};
