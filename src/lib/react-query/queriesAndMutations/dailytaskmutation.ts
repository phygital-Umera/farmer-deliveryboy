import {
  addDailyTask,
  getDailyTasks,
  getDailyTaskById,
  updateDailyTask,
  deleteDailyTask,
  dailyTaskReview,
  saveDailyTaskRemark,
} from '@/lib/api/admin/dailytask';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';


export const useAddDailyTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDailyTask,
    onSuccess: (_, variables) => {
      toast.success('Daily task added successfully');
      queryClient.invalidateQueries({
        queryKey: ['dailytasks', variables.batchId],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to save daily task';
      toast.error(message);
    },
  });
};


export const useGetDailyTasks = (batchId: string , role:string) => {
  return useQuery({
    queryKey: ['dailytasks', batchId , role],
    queryFn: () => getDailyTasks(batchId , role),
    enabled: !!batchId,
  });
};


export const useGetDailyTaskById = (taskId: string , role:string) => {
  return useQuery({
    queryKey: ['dailytask', taskId , role],
    queryFn: () => getDailyTaskById(taskId , role),
    enabled: !!taskId,
  });
};


export const useUpdateDailyTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({taskId, data , role}: {taskId: string; data: any , role:string}) =>
      updateDailyTask(taskId, data , role),
    onSuccess: (_, variables) => {
      toast.success('Daily task updated successfully');
      queryClient.invalidateQueries({
        queryKey: ['dailytasks'],
      });
      queryClient.invalidateQueries({
        queryKey: ['dailytask', variables.taskId],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update daily task';
      toast.error(message);
    },
  });
};

export const useDeleteDailyTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDailyTask,
    onSuccess: () => {
      toast.success('Daily task deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['dailytasks'],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to delete daily task';
      toast.error(message);
    },
  });
};

export const useGetDailyReview=(taskId:string, role:string)=>{
  return useQuery({
 
    queryFn: () =>dailyTaskReview(taskId , role),
    queryKey: ['dailytask', taskId , role],
 
  });
}

export const useAddDailyTaskRemarks=()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, remarks , role}: {id: string; remarks: string , role:string}) =>
      saveDailyTaskRemark(id, role, { remark: remarks }),
    onSuccess: () => {
      toast.success('Remarks added successfully!');
      queryClient.invalidateQueries({
        queryKey: ['exam-review'],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to add remarks';
      toast.error(message);
    },
  });
}