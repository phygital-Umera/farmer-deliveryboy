import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getCourse, getStudentReferal, referalForm } from "@/lib/api/student/referalFormApi";

export const useReferalForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => referalForm(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referal'] });
            toast.success('Referal Form submitted successfully!');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Referal Form submitted failed';
            toast.error(message);
        },
    });
};



export const useGetCourse = () => {
    return useQuery({
        queryKey: ['course'],
        queryFn:() => getCourse(),
    });
}


export const useGetStudentReferal = () => {
    return useQuery({
        queryKey: ['referal'],
        queryFn:() => getStudentReferal(),
    });
}