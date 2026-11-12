import { addFees, addFeesFollowup } from "@/lib/api/admin/feesapi";
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useAddFees = () => {
  return useMutation({
    mutationFn: ({
      data,
      role,
 
    }: {
      data: any;
      role: string;
     
    }) => addFees(data, role),

    onSuccess: () => {
      toast.success("Fees added successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add fees");
    },
  });
};

export const useAddFeesFollowUp = () => {
  return useMutation({
    mutationFn: ({ payload, role }: { payload: any; role: string }) =>
      addFeesFollowup(payload, role),

    onSuccess: () => {
      toast.success("Fees FollowUp added successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add fees FollowUp");
    },
  });
};