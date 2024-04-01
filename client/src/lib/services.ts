import axios from "axios";
import { API_URL } from "./utils";
import { RequestType, Params } from "./servicesTypes";

export const commonAPI = async (
  endpoint: string = "",
  reqType: RequestType = "GET",
  params: Params = {}
) => {
  const url = `${API_URL}/${endpoint}`;

  switch (reqType) {
    case "POST":
      return await axios.post(url, params);
    case "PUT":
      return await axios.put(url, params);
    case "DELETE":
      return await axios.delete(url);
    default:
      return await axios.get(url);
  }
};
// commonAPI("", "POST", { name: "hb" });
