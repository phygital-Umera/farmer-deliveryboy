import {  payReferToStudent, registerStudent, updateStudent } from '@/lib/api/admin/studentApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useRegisterStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, role }: { payload: any; role?: string }) =>
      registerStudent(payload, role),
    onSuccess: () => {
      toast.success('Student registered successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register student');
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload, role }: { id: string; payload: any; role?: string }) =>
      updateStudent(id, payload, role),
    onSuccess: () => {
      toast.success('Student updated successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update student');
    },
  });
};


export const usePayReferToStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, role }: { payload: any; role?: string }) =>
      payReferToStudent(payload, role),
    onSuccess: () => {
      toast.success('Refer amount paid successfully');
      queryClient.invalidateQueries({ queryKey: ['referal'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to pay refer amount');
    },
  });
};
