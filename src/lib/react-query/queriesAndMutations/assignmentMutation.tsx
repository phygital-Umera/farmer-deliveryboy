// lib/react-query/queriesAndMutations/assignmentMutation.ts

import { api } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ==================== TYPES ====================

export interface Assignment {
  id: string;
  assignmentName: string;
  description: string;
  attachment: string | null;
  remark: string | null;
  deadline: string | null;
  batchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFormData {
  assignmentName: string;
  description: string;
  attachment?: File | string | null;
  remark?: string;
  deadline?: string;
  batchId?: string;
}

// ==================== API FUNCTIONS ====================

// Get all assignments for a batch
const getAssignmentsByBatch = async (batchId: string, role?: string): Promise<Assignment[]> => {
  try {
    let url = '';
    if (role === 'ADMIN') {
      url = `/admin/batches/assignments/${batchId}`;
    } else if (role === 'TEACHER' || role === 'FACULTY') {
      url = `/teacher/batches/assignments/${batchId}`;
    } else {
      url = `/batches/assignments/${batchId}`;
    }

    const response = await api.get(url, {
      headers: role ? { 'Role': role } : {},
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to fetch assignments:', { message });
    toast.error(`Failed to fetch assignments: ${message}`);
    throw error;
  }
};

// Get assignment by ID
const getAssignmentById = async (id: string, role?: string): Promise<Assignment> => {
  try {
    let url = '';
    if (role === 'ADMIN') {
      url = `/admin/batches/assignments/byId/${id}`;
    } else if (role === 'TEACHER' || role === 'FACULTY') {
      url = `/teacher/batches/assignments/byId/${id}`;
    } else {
      url = `/batches/assignments/byId/${id}`;
    }

    const response = await api.get(url, {
      headers: role ? { 'Role': role } : {},
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to fetch assignment:', { message });
    toast.error(`Failed to fetch assignment: ${message}`);
    throw error;
  }
};

// Create new assignment
const createAssignment = async (payload: FormData, role?: string): Promise<Assignment> => {
  try {
    let url = '';
    const batchId = payload.get('batchId');

    if (role === 'ADMIN') {
      url = `/admin/batches/assignments/${batchId}`;
    } else if (role === 'TEACHER' || role === 'FACULTY') {
      url = `/teacher/batches/assignments/${batchId}`;
    } else {
      url = `/batches/assignments/${batchId}`;
    }

    const response = await api.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(role ? { 'Role': role } : {}),
      },
    });
    toast.success('Assignment created successfully!');
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    const details = error?.response?.data?.errors;
    console.error('Failed to create assignment:', { message, details });
    toast.error(`Failed to create assignment: ${message}`);
    throw error;
  }
};

// Update assignment
const updateAssignment = async ({ id, payload, role }: { id: string; payload: FormData; role?: string }): Promise<Assignment> => {
  try {
    let url = '';
    if (role === 'ADMIN') {
      url = `/admin/batches/assignments/byId/${id}`;
    } else if (role === 'TEACHER' || role === 'FACULTY') {
      url = `/teacher/batches/assignments/byId/${id}`;
    } else {
      url = `/batches/assignments/byId/${id}`;
    }

    const response = await api.put(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(role ? { 'Role': role } : {}),
      },
    });
    toast.success('Assignment updated successfully!');
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    const details = error?.response?.data?.errors;
    console.error('Failed to update assignment:', { message, details });
    toast.error(`Failed to update assignment: ${message}`);
    throw error;
  }
};

// Delete assignment
const deleteAssignment = async ({ id, role }: { id: string; role?: string }): Promise<void> => {
  try {
    let url = '';
    if (role === 'ADMIN') {
      url = `/admin/batches/assignments/byId/${id}`;
    } else if (role === 'TEACHER') {
      url = `/teacher/batches/assignments/byId/${id}`;
    } else {
      url = `/assignments/${id}`;
    }

    await api.delete(url, {
      headers: role ? { 'Role': role } : {},
    });
    toast.success('Assignment deleted successfully!');
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Failed to delete assignment:', { message });
    toast.error(`Failed to delete assignment: ${message}`);
    throw error;
  }
};

// ==================== QUERY HOOKS ====================

// Get assignments by batch
export const useGetAssignmentsByBatch = (batchId: string, role?: string) => {
  return useQuery({
    queryKey: ['assignments', 'batch', batchId, role],
    queryFn: () => getAssignmentsByBatch(batchId, role),
    enabled: !!batchId,
  });
};

// Get assignment by ID
export const useGetAssignmentById = (id: string, role?: string) => {
  return useQuery({
    queryKey: ['assignment', id, role],
    queryFn: () => getAssignmentById(id, role),
    enabled: !!id,
  });
};

// ==================== MUTATION HOOKS ====================

// Create assignment
export const useAddAssignment = (role?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, role: roleParam }: { payload: FormData; role?: string }) =>
      createAssignment(payload, roleParam || role),
    onSuccess: (data, variables) => {
      // Invalidate and refetch assignments list
      queryClient.invalidateQueries({ queryKey: ['assignments'] });

      // If batchId is present in the form data, invalidate that specific batch
      const batchId = variables.payload.get('batchId');
      if (batchId) {
        queryClient.invalidateQueries({
          queryKey: ['assignments', 'batch', batchId]
        });
      }
    },
    onError: (error) => {
      console.error('Error creating assignment:', error);
    },
  });
};

// Update assignment
export const useUpdateAssignment = (role?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, role: roleParam }: { id: string; payload: FormData; role?: string }) =>
      updateAssignment({ id, payload, role: roleParam || role }),
    onSuccess: (data, variables) => {
      // Invalidate specific assignment
      queryClient.invalidateQueries({
        queryKey: ['assignment', variables.id]
      });

      // Invalidate assignments list
      queryClient.invalidateQueries({ queryKey: ['assignments'] });

      // If batchId is present in the form data, invalidate that specific batch
      const batchId = variables.payload.get('batchId');
      if (batchId) {
        queryClient.invalidateQueries({
          queryKey: ['assignments', 'batch', batchId]
        });
      }
    },
    onError: (error) => {
      console.error('Error updating assignment:', error);
    },
  });
};

// Delete assignment
export const useDeleteAssignment = (role?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role: roleParam }: { id: string; role?: string }) =>
      deleteAssignment({ id, role: roleParam || role }),
    onSuccess: (data, variables) => {
      // Invalidate assignments list
      queryClient.invalidateQueries({ queryKey: ['assignments'] });

      // Remove the assignment from cache
      queryClient.removeQueries({
        queryKey: ['assignment', variables.id]
      });
    },
    onError: (error) => {
      console.error('Error deleting assignment:', error);
    },
  });
};

// ==================== EXPORTS ====================

export default {
  useGetAssignmentsByBatch,
  useGetAssignmentById,
  useAddAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
};