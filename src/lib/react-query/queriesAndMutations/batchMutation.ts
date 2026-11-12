import { createBatch, deleteBatch, getBatchById, getBatches, updateBatch } from "@/lib/api/admin/batchapi";
import { addNextFollowUp, LeadData, updateLead } from "@/lib/api/admin/LeadApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, role }: { payload: any; role?: string }) =>
      createBatch(payload, role),
    onSuccess: () => {
      toast.success('Batch added successfully');
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save batch');
    },
  });
};

export const useGetBatches = (role?: string) => {
  return useQuery({
    queryKey: ['batches', role],
    queryFn: () => getBatches(role),
    enabled: Boolean(role),
  });
}

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, role }: { id: string; payload: any; role?: string }) =>
      updateBatch(id, payload, role),
    onSuccess: () => {
      toast.success('Batch updated successfully');
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update batch');
    },
  });
};

export const useDeleteBatch = (role?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteBatch(id, role),
    onSuccess: () => {
      toast.success('Batch deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete batch');
    },
  });
};

export const useGetBatchById = (id?: string, role?: string) => {
  return useQuery({
    queryKey: ['batch', id, role],
    queryFn: () => getBatchById(id!, role),
    enabled: Boolean(id) && Boolean(role),
  });
}

export const useUpdateBatchLeadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, data, role }: { leadId: string; data: Partial<LeadData>; role?: string }) =>
      updateLead(leadId, data, role),
    onSuccess: (_, variables) => {
      toast.success('Lead updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.leadId] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update lead';
      toast.error(message);
    },
  });
};

export const useBatchAddNextFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, role }: { data: any; role?: string }) =>
      addNextFollowUp(data, role),
    onSuccess: (_, variables) => {
      toast.success('Next follow-up added successfully');
      // Invalidate both lead and followups queries
      queryClient.invalidateQueries({ queryKey: ['lead'] });
      queryClient.invalidateQueries({ queryKey: ['followups'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add follow-up');
    },
  });
};