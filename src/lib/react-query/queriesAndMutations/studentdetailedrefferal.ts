import { api } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetStudentsByBatch= (studentId?: string, role?: string) => {
  return useQuery({
    queryKey: ['students', 'batch', studentId, role],
    queryFn: () => getStudentsByBatch(studentId as string, role as string),
    enabled: Boolean(studentId && role),
  });
}; 



export const getStudentsByBatch = async (studentId: string, role: string) => {
  try {
    let url = '';
    if (role === 'ADMIN') {
      url = `/admin/students/${studentId}`;
    } else if (role === 'TEACHER' || role === 'FACULTY') {
      url = `/teacher/students/${studentId}`;
    } else {
      url = `/students/${studentId}`;
    }
    const response = await api.get(url);
    console.log("useGetStudentsByBatch",response.data)
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to fetch students:', { message });
    toast.error(`Failed to fetch students: ${message}`);
    throw error;
  }
};


export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, role }: { data: any; role?: string }) =>
      processPayment(data, role),
    onSuccess: () => {
      toast.success('Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to process payment');
    },
  });
};
export const processPayment = async (data: any, role?: string) => {
  try {
    let url = '';
    if (role === 'ADMIN') {
      url = '/admin/payments';
    } else if (role === 'TEACHER' || role === 'FACULTY') {
      url = '/teacher/payments';
    } else {
      url = '/payments';
    }
    const response = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to process payment:', { message });
    toast.error(`Failed to process payment: ${message}`);
    throw error;
  }
};