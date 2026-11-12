import { api } from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Types
interface ReferralPayload {
    studentId: string;
    batchId: string;
    name: string;
    refralName: string;
    phoneNumber: string; // Changed from number to phoneNumber
    qualification: string;
    intrest: string;
    courseId: string; // Changed from course to courseId
    referId?: string;
}

interface ReferralResponse {
    statusCode: number;
    status: boolean;
    message: string;
    data: any;
}

interface Referral {
    id: string;
    name: string;
    refralName: string;
    phoneNumber: string; // Changed from number to phoneNumber
    qualification: string;
    intrest: string;
    courseId: string; // Changed from course to courseId
    studentId: string;
    batchId: string;
    referId?: string;
    createdAt: string;
    updatedAt: string;
}

// Helper to get role-based API path
const getRolePath = (role: string): string => {
    if (role === 'ADMIN' || role === 'SUPERADMIN') {
        return '/admin';
    } else if (role === 'TEACHER' || role === 'FACULTY') {
        return '/teacher';
    }
    return '';
};

// GET Referrals - using the correct endpoint
const getReferrals = async (role: string, batchId?: string): Promise<Referral[]> => {
    const rolePath = getRolePath(role);
    // Use the correct endpoint: /admin/batch/refer/referId
    const url = `${rolePath}/batches/refer/${batchId}`;
    const response = await api.get<ReferralResponse>(url, {
        headers: {
            role: role,
        },
    });
    return response.data.data || response.data || [];
};


const createReferral = async (payload: ReferralPayload, role: string): Promise<ReferralResponse> => {
    const rolePath = getRolePath(role);
    const leadPayload = {
        studentId: payload.studentId,
        batchId: payload.batchId,
        referId: payload.referId || payload.refralName,
        name: payload.name,
        phoneNumber: payload.phoneNumber, 
        qualification: payload.qualification,
        intrest: payload.intrest,
        courseId: payload.courseId, 
    };
    
    const response = await api.post<ReferralResponse>(`${rolePath}/leads`, leadPayload, {
        headers: {
            role: role,
        }
    });
    return response.data;
};

// PUT Update Referral
const updateReferral = async (id: string, payload: Partial<ReferralPayload>, role: string): Promise<ReferralResponse> => {
    const rolePath = getRolePath(role);
    const response = await api.put<ReferralResponse>(`${rolePath}/referral/${id}`, payload, {
        headers: {
            role: role,
        },
    });
    return response.data;
};

// DELETE Referral
const deleteReferral = async (id: string, role: string): Promise<ReferralResponse> => {
    const rolePath = getRolePath(role);
    const response = await api.delete<ReferralResponse>(`${rolePath}/referral/${id}`, {
        headers: {
            role: role,
        },
    });
    return response.data;
};

// React Query Hooks


export const useGetReferrals = (role: string, studentId?: string) => {
    return useQuery({
        queryKey: ['referrals', studentId || 'all', role],
        queryFn: () => getReferrals(role, studentId),
        enabled: !!role,
        staleTime: 5 * 60 * 1000, 
    });
};

export const useSubmitReferral = (role: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ReferralPayload) => createReferral(payload, role),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['referrals'] });
            console.log('Referral created successfully:', data);
        },
        onError: (error: AxiosError) => {
            console.error('Error creating referral:', error);
            throw error;
        },
    });
};


export const useUpdateReferral = (role: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<ReferralPayload> }) =>
            updateReferral(id, payload, role),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['referrals'] });
            queryClient.invalidateQueries({ queryKey: ['referrals', variables.id] });
            console.log('Referral updated successfully:', data);
        },
        onError: (error: AxiosError) => {
            console.error('Error updating referral:', error);
            throw error;
        },
    });
};

export const useDeleteReferral = (role: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteReferral(id, role),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['referrals'] });
            console.log('Referral deleted successfully:', data);
        },
        onError: (error: AxiosError) => {
            console.error('Error deleting referral:', error);
            throw error;
        },
    });
};