import { addExpenditure, deleteExpenditure, editExpenditure, getExpenditure, getExpenditureById } from "@/lib/api/admin/expenditure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, role }: { data: any; role?: string }) => addExpenditure(data, role),
    onSuccess: () => {
       toast.success('Expenditure added successfully');
      queryClient.invalidateQueries({queryKey: ['expenditures']});
    },
    onError: () => {
      toast.error('Failed to save placement');
    },
  });
};

export const useGetExpenditure = (role?: string) => {
  return useQuery({
    queryKey: ['expenditures', role],
    queryFn: () => getExpenditure(role),
  });
}

export const useGetExpenditureById = (id: string, role?: string) => {
  return useQuery({
    queryKey: ['expenditure', id, role],
    queryFn: () => getExpenditureById(id, role),
    enabled: !!id,
  });
}

export const useUpdateExpenditure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data, role}: {id: string; data: any; role?: string}) => editExpenditure(id, data, role),
    onSuccess: () => {
      toast.success('Expenditure updated successfully');
      queryClient.invalidateQueries({queryKey: ['expenditures']});
      queryClient.invalidateQueries({queryKey: ['expenditure']});
    },
    onError: () => {
      toast.error('Failed to update expenditure');
    },
  });
};

export const useDeleteExpenditure = (role?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpenditure(id, role),
    onSuccess: () => {
      toast.success('Expenditure deleted successfully');
      queryClient.invalidateQueries({queryKey: ['expenditures']});
    },
    onError: () => {
      toast.error('Failed to delete expenditure');
    },
  });
};