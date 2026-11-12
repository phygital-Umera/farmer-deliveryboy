import {
  assignStudentToPlacement,
  deletePlacementStudent,
  getPlacementStudentById,
  getPlacementStudents,
  updatePlacementStudent,
} from '@/lib/api/admin/placementStudentApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';


export const useAssignStudentToPlacement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, role }: { payload: any; role?: string }) =>
      assignStudentToPlacement(payload, role),
    onSuccess: () => {
      toast.success('Student assigned to placement successfully');
      queryClient.invalidateQueries({ queryKey: ['placementStudents'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to assign student');
    },
  });
};


export const useGetPlacementStudents = (
  params?: { page?: number; limit?: number; search?: string },
  role?: string,
) => {
  return useQuery({
    queryKey: ['placementStudents', params, role],
    queryFn: () => getPlacementStudents(params, role),
    enabled: Boolean(role),
  });
};

// GET by ID
export const useGetPlacementStudentById = (id: string, role?: string) => {
  return useQuery({
    queryKey: ['placementStudent', id, role],
    queryFn: () => getPlacementStudentById(id, role),
    enabled: Boolean(id) && Boolean(role),
  });
};

// PATCH - Update relation
export const useUpdatePlacementStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload, role }: { id: string; payload: any; role?: string }) =>
      updatePlacementStudent(id, payload, role),
    onSuccess: () => {
      toast.success('Placement student updated successfully');
      queryClient.invalidateQueries({ queryKey: ['placementStudents'] });
      queryClient.invalidateQueries({ queryKey: ['placementStudent'] });
    },
    onError: () => {
      toast.error('Failed to update placement student');
    },
  });
};

// DELETE
export const useDeletePlacementStudent = (role?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlacementStudent(id, role),
    onSuccess: () => {
      toast.success('Placement student removed successfully');
      queryClient.invalidateQueries({ queryKey: ['placementStudents'] });
    },
    onError: () => {
      toast.error('Failed to remove placement student');
    },
  });
};
