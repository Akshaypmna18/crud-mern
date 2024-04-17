import { useToast } from "@/components/ui/use-toast";

const useToastHook = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string) => {
    toast({
      variant: "success",
      title: title,
      duration: 2500,
    });
  };

  const showErrorToast = (errorMessage: string) => {
    toast({
      variant: "destructive",
      title: "Ohoh Something went wrong",
      description: errorMessage,
      duration: 2500,
    });
  };

  return { showSuccessToast, showErrorToast };
};

export default useToastHook;
