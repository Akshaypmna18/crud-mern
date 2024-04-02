export const errorToast = (err: any) => {
  return {
    variant: "destructive",
    title: "Ohoh Something went wrong",
    description: err.message,
    duration: 2500,
  };
};
