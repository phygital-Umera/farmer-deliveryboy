import { api } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
export const useGetStudentDailyTask  = () => {
  return useQuery({
    queryKey: ['student-dailytasks'],
    queryFn: () => getStudentDailyTasks(),
    
  });
};

export const getStudentDailyTasks = async () => {
  try {
    const response = await api.get(`/student/daily-tasks`);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to fetch daily tasks:', {message});
    throw error;
  }
};