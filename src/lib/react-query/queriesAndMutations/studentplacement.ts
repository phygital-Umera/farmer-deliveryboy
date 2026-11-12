import { api } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useGetStudentPlacements = () => {
    return useQuery({
        queryKey: ['student-placements'],
        queryFn: async () => {
            const response = await api.get('/student/placement');
            return response.data;
        },
    });
};

export const useApplyForPlacement = () => {
    return useMutation({
        mutationFn: async ({ placementId }: { placementId: string }) => {
            const response = await api.post(`/student/placement/${placementId}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Applied for placement successfully!");
        },
        onError: (error: any) => {
            toast.error("You already applied for this placement");
        }
    });
};


export const assignInterviewToStudent = () => {
    return useMutation({
        mutationFn: async ({ placementId, data, role }: { placementId: string, data: any, role: string }) => {
            const response = role === 'ADMIN' ? await api.post(`/admin/placements/schedule/${placementId}`, data) : await api.post(`/teacher/placements/schedule/${placementId}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Interview assigned successfully!");
        },
        onError: (error: any) => {
            toast.error("Failed to assign interview");
        }
    });
};