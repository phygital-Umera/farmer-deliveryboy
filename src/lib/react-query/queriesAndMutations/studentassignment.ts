import { api } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
export const useGetStudentAssignment  = () => {
  return useQuery({
    queryKey: ['student-assignment'],
    queryFn: () => getStudentAssignment(),
    
  });
};

export const getStudentAssignment = async () => {
  try {
    const response = await api.get(`/student/assignments`);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to fetch assignments:', {message});
    throw error;
  }
};