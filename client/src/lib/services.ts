import axios from "axios";
import { API_URL } from "./utils";
import { RequestType, Params } from "./servicesTypes";

export const commonAPI = async (
  endpoint: string = "",
  reqType: RequestType = "GET",
  params: Params = {}
) => {
  const url = `${API_URL}/${endpoint}`;
  const config = {
    // timeout: 5000,
  };

  switch (reqType) {
    case "POST":
      return await axios.post(url, params, config);
    case "PUT":
      return await axios.put(url, params, config);
    case "DELETE":
      return await axios.delete(url, config);
    default:
      return await axios.get(url, config);
  }
};
