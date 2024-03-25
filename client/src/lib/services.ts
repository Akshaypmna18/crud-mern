import axios from "axios";
import { API_URL } from "./utils";
import { RequestType, Params } from "./servicesTypes";

export const commonAPI = async (
  endpoint: string = "",
  reqType: RequestType = "GET",
  params: Params = {}
) => {
  let response = "";
  const url = `${API_URL}/${endpoint}`;

  switch (reqType) {
    case "POST":
      response = await axios.post(url, params);
      return response;
    case "PUT":
      response = await axios.put(url, params);
      return response;
    case "DELETE":
      response = await axios.delete(url);
      return response;
    default:
      response = await axios.get(url);
      return response;
  }
};
// commonAPI("", "POST", { name: "bh" });
