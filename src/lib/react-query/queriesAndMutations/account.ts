

import { api } from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

// ==================== API FUNCTIONS ====================

// Get all accounts
export const getAccounts = async (role?: string) => {
    try {
        let url = '';
        if (role === 'ADMIN') {
            url = '/admin/accounts';
        } else if (role === 'TEACHER' || role === 'FACULTY') {
            url = '/teacher/accounts';
        } else {
            url = '/accounts';
        }
        const response = await api.get(url);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Failed to fetch accounts:', { message });
        toast.error(`Failed to fetch accounts: ${message}`);
        throw error;
    }
};

// Get account by ID
export const getAccountById = async (id: string, role?: string) => {
    try {
        let url = '';
        if (role === 'ADMIN') {
            url = `/admin/accounts/${id}`;
        } else if (role === 'TEACHER' || role === 'FACULTY') {
            url = `/teacher/accounts/${id}`;
        } else {
            url = `/accounts/${id}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Failed to fetch account:', { message });
        toast.error(`Failed to fetch account: ${message}`);
        throw error;
    }
};

// Add account
export const addAccount = async (data: any, role?: string) => {
    try {
        let url = '';
        if (role === 'ADMIN') {
            url = '/admin/accounts';
        } else if (role === 'TEACHER' || role === 'FACULTY') {
            url = '/teacher/accounts';
        } else {
            url = '/accounts';
        }
        const response = await api.post(url, data);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Failed to add account:', { message });
        toast.error(`Failed to add account: ${message}`);
        throw error;
    }
};

// Update account
export const updateAccount = async (id: string, data: any, role?: string) => {
    try {
        let url = '';
        if (role === 'ADMIN') {
            url = `/admin/accounts/${id}`;
        } else if (role === 'TEACHER' || role === 'FACULTY') {
            url = `/teacher/accounts/${id}`;
        } else {
            url = `/accounts/${id}`;
        }
        const response = await api.put(url, data);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Failed to update account:', { message });
        toast.error(`Failed to update account: ${message}`);
        throw error;
    }
};

// Delete account
export const deleteAccount = async (id: string, role?: string) => {
    try {
        let url = '';
        if (role === 'ADMIN') {
            url = `/admin/accounts/${id}`;
        } else if (role === 'TEACHER' || role === 'FACULTY') {
            url = `/teacher/accounts/${id}`;
        } else {
            url = `/accounts/${id}`;
        }
        const response = await api.delete(url);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Failed to delete account:', { message });
        toast.error(`Failed to delete account: ${message}`);
        throw error;
    }
};

const getAccountHistoryById = async (id: string, role?: string) => {
    try {
        let url = '';
        if (role === 'ADMIN') {
            url = `/admin/accounts/${id}`;
        } else if (role === 'TEACHER') {
            url = `/teacher/accounts/${id}`;
        } else {
            url = `/accounts/${id}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Failed to fetch account:', { message });
        toast.error(`Failed to fetch account: ${message}`);
        throw error;
    }
};

// ==================== REACT QUERY HOOKS ====================

// Get all accounts
export const useGetAccounts = (role?: string) => {
    return useQuery({
        queryKey: ['accounts', role],
        queryFn: () => getAccounts(role),
        enabled: Boolean(role),
    });
};

// Get account by ID
export const useGetAccountById = (id: string, role?: string) => {
    return useQuery({
        queryKey: ['account', id, role],
        queryFn: () => getAccountById(id, role),
        enabled: Boolean(id && role),
    });
};

// Add account
export const useAddAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, role }: { data: any; role?: string }) =>
            addAccount(data, role),
        onSuccess: () => {
            toast.success('Account added successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add account');
        },
    });
};

// Update account
export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data, role }: { id: string; data: any; role?: string }) =>
            updateAccount(id, data, role),
        onSuccess: (_, variables) => {
            toast.success('Account updated successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update account');
        },
    });
};

// Delete account
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string; role?: string }) =>
            deleteAccount(id, role),
        onSuccess: () => {
            toast.success('Account deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete account');
        },
    });
};

export const useGetAccountHistoryById = (id: string, role?: string) => {
    return useQuery({
        queryKey: ['account', id, role],
        queryFn: () => getAccountHistoryById(id, role),
        enabled: Boolean(id && role),
    });
};