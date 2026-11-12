import { addFaculty, deleteFaculty, editFaculty, getFaculty, getFacultyById } from "@/lib/api/admin/addFaculty";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddFaculty = () => {
  const queryClient = useQueryClient();
  console.log("useAddFaculty called");
  return useMutation({
    mutationFn: addFaculty,
    onSuccess: () => {
      toast.success('Faculty added successfully');
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },

    onError: () => {
      toast.error('Failed To Save client');
    },
  });
};

export const useEditFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editFaculty,
    onSuccess: () => {
      toast.success('Faculty updated successfully');
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
    onError: () => {
      toast.error('Failed to update faculty');
    },
  });
};

export const useGetFaculties = (role?: string) => {
  return useQuery({
    queryKey: ['faculties', role],
    queryFn: getFaculty,
    enabled: role === 'ADMIN', 
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      toast.success('Faculty deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
    onError: () => {
      toast.error('Failed To Delete Faculty');
    },
  });
};

export const useGetFacultyById = (id: string) => {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: () => getFacultyById(id),
  });
};

