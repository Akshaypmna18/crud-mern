import React from "react";
import App from "./App";

export default {
  title: "App",
  Component: App,
};

export const Component = (args: any) => <App {...args} />;
