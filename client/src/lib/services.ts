import axios, { AxiosResponse } from "axios";
import { API_URL } from "./utils";
import { RequestType, Params } from "./servicesTypes";

export const commonAPI = async <T = unknown>(
  endpoint: string = "",
  reqType: RequestType = "GET",
  params: Params = {}
): Promise<AxiosResponse<T>> => {
  const url = `${API_URL}/${endpoint}`;
  const config = {
    timeout: 7500,
    retry: 1,
  };

  switch (reqType) {
    case "POST":
      return await axios.post<T>(url, params, config);
    case "PUT":
      return await axios.put<T>(url, params, config);
    case "DELETE":
      return await axios.delete<T>(url, config);
    default:
      return await axios.get<T>(url, config);
  }
};
