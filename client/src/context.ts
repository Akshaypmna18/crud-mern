import { createContext, SetStateAction } from "react";

export const Context = createContext<SetStateAction<any> | null>(null);
