export const errorToast = (err: unknown) => {
  const errorMessage =
    err instanceof Error ? err.message : "An unknown error occurred";

  return {
    variant: "destructive",
    title: "Ohoh Something went wrong",
    description: errorMessage,
    duration: 2500,
  };
};
