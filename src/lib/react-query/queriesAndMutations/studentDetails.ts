import { deleteStudent, getStudent, getStudentById, getUsername } from "@/lib/api/admin/StudentDetails";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useGetStudent = (role?: string) => {
  return useQuery({
    queryKey: ['students', role],
    queryFn: () => getStudent(role),
    enabled: Boolean(role),
  });
};

export const useGetStudentById = (id: string, role?: string) => {
  return useQuery({
    queryKey: ['student', id, role],
    queryFn: () => getStudentById(id, role),
    enabled: Boolean(id) && Boolean(role),
  });
};


export const useGetUsername = () => {
  return useQuery({
    queryKey: ['username'],
    queryFn: getUsername,
  });
};

export const useDeleteStudent = (role?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudent(id, role),
    onSuccess: () => {
      toast.success('Student deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      toast.error('Failed to delete student');
    },
  });
};
