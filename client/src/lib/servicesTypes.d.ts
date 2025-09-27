export type RequestType = "GET" | "POST" | "PUT" | "DELETE" | "";
export type Params =
  | {
      name: string;
      quantity?: number;
      price?: number;
      image?: string;
    }
  | {};

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}
