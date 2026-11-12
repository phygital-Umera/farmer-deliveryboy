import { examAdminAnalysis, examAnalysis, Exams, getExambyId, getExamResult, submitExam } from "@/lib/api/student/Exam";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetStudentExams = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: () => Exams(),

  });
};

export const useGetExamResult = (id: string) => {
  return useQuery({
    queryKey: ['exams-result', id],
    queryFn: () => getExamResult(id),

  });
};

export const useGetExamAnalysis = (id: string) => {
  return useQuery({
    queryKey: ['exam-analysis', id],
    queryFn: () => examAnalysis(id),

  })
}
export const useAdminGetExamAnalysis = (studentId: string, examId: string , role:string) => {
  return useQuery({
    queryKey: ['exam-analysis', studentId, examId],
    queryFn: () => examAdminAnalysis(studentId, examId , role),

  })
}

export const useGetExamById = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => getExambyId(id),
  });
}

export const useSubmitExam = () => {
  return useMutation({
    mutationFn: ({ examId, payload }: { examId: string, payload: any }) => submitExam(examId, payload),
    onSuccess: () => {
      toast.success('Exam submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to submit exam');
    }
  });
}

