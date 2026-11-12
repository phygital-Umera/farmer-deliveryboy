import { getstudentInterview, updateInterviewStatus } from "@/lib/api/student/interviewApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useStudentGetInterview=()=>{
    return useQuery({
        queryKey:['student-interviews'],
        queryFn:async ()=>{
            const response = await getstudentInterview();
            return response;
        }
    })
}

export const useStudentUpdateInterview=()=>{
    return useMutation({
        mutationFn:async ({id, status}:any)=>{
            const response = await updateInterviewStatus(id, status);
            return response;
        },
        onSuccess:()=>{
            toast.success("Interview Status updated successfully");
        },
        onError:(error:any)=>{
            toast.error(error.message);
        }
    })
}