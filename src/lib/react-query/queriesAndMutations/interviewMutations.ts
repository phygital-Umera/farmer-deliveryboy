import { assignInterview, AssignInterviewData, getInterviewDetails } from "@/lib/api/admin/interviewApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAssignInterviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placementId, interviewDetails, role }: { 
      placementId: string; 
      interviewDetails?: {
        student: { studentId: string }[]; 
        interviewMode?: string;
        interviewDate?: string;  
        interviewLocation?: string;
      };
      role?: string;
    }) => assignInterview(placementId, interviewDetails, role),
    onSuccess: () => {
      toast.success('Students assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['placements'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-students'] });
    },
    onError: (error: any) => {
      console.error('Assignment error:', error);
      toast.error(error?.response?.data?.message || 'Failed to assign students');
    },
  });
};

export const useGetInterviewDetails = (interviewId: string) => {
    return useQuery({
        queryKey: ['interview', interviewId],
        queryFn: () => getInterviewDetails(interviewId),
        enabled: !!interviewId,
    });
};