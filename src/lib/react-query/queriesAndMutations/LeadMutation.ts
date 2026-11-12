import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  LeadData,
  addNextFollowUp,
  getFollowUpById,
  deleteFollowUp,
} from "@/lib/api/admin/LeadApi";


export const useCreateLeadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, role }: { data: any; role?: string }) =>
      createLead(data, role),
    onSuccess: () => {
      toast.success('Lead created successfully');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create lead');
    },
  });
};

// Get All Leads
export const useGetLeads = (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  courseId?: string;
  batchId?: string;
  teacherId?: string;
  batchType?: string;
}, role?: string) => {
  return useQuery({
    queryKey: ['leads', params, role],
    queryFn: () => getLeads(params, role),
    enabled: Boolean(role),
  });
};

export const useGetLeadById = (leadId: string, role?: string) => {
  return useQuery({
    queryKey: ['lead', leadId, role],
    queryFn: () => getLeadById(leadId, role),
    enabled: Boolean(leadId) && Boolean(role),
  });
};

export const useAddNextFollowUp = () => {
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

// Update Lead Mutation
export const useUpdateLeadMutation = () => {
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

// Delete Lead Mutation
export const useDeleteLeadMutation = (role?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leadId: string) => deleteLead(leadId, role),
    onSuccess: () => {
      toast.success('Lead deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
    },
  });
};

export const useGetFollowUpById = (followUpId: string, role?: string) => {
  return useQuery({
    queryKey: ['followup', followUpId, role],
    queryFn: () => getFollowUpById(followUpId, role),
    enabled: Boolean(followUpId && role),
  });
};

export const useDeleteFollowUpMutation = (role?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followUpId: string) => deleteFollowUp(followUpId, role),
    onSuccess: () => {
      toast.success('Follow-up deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['lead', 'leadFollowUps'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete follow-up';
      toast.error(message);
    },
  });
};