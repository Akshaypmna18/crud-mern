export type RequestType = "GET" | "POST" | "PUT" | "DELETE" | "";
export type Params =
  | {
      name: string;
      quantity?: number;
      price?: number;
      image?: string;
    }
  | {};
