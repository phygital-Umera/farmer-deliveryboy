import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  addQuestionToExam,
  getExamQuestions,
  updateQuestion,
  deleteQuestion,
  ExamData,
  getAllExams,
  assignExamToBatch,
  getBatchExams,
  getExamReview,
  saveRemark,
} from '@/lib/api/admin/examApi';

export const useCreateExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, batchId ,role }: { data: ExamData; batchId: string; role: string }) => createExam(data, batchId, role),
    onSuccess: () => {
      toast.success('Exam created successfully!');
      queryClient.invalidateQueries({queryKey: ['exams']});
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create exam';
      toast.error(message);
    },
  });
};

export const useGetExams = (id: string) => {
  return useQuery({
    queryKey: ['exams', id],
    queryFn: () => getExams(id),
    enabled: !!id,
  });
};


export const useGetAllExams = (role:string) => {
  return useQuery({
    queryKey: ['all-exams', role],
    queryFn: () => getAllExams(role),
    
  });
};

export const useBatchExams = (batchId: string ,role:string) => {
  return useQuery({
    queryKey: ['batch-exams', batchId , role],
    queryFn: () => getBatchExams(batchId , role),
    enabled: !!batchId,
  });
};

export const useGetExamById = (examId: string , role:string) => {
  return useQuery({
    queryKey: ['exam', examId , role],
    queryFn: () => getExamById(examId , role),
    enabled: !!examId,
  });
};

export const useUpdateExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, data , role}: { examId: string; data: any , role:string }) =>
      updateExam(examId, data , role),
    onSuccess: (_, variables) => {
      toast.success('Exam updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update exam';
      toast.error(message);
    },
  });
};;

export const useDeleteExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onSuccess: () => {
      toast.success('Exam deleted successfully!');
      queryClient.invalidateQueries({queryKey: ['exams']});
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete exam';
      toast.error(message);
    },
  });
};

// Questions Mutations
export const useAddQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({examId, question}: {examId: string; question: any}) =>
      addQuestionToExam(examId, question),
    onSuccess: (_, variables) => {
      toast.success('Question added successfully!');
      queryClient.invalidateQueries({
        queryKey: ['exam-questions', variables.examId],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to add question';
      toast.error(message);
    },
  });
};

export const useAssignExamToBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({examId, batchId , role}: {examId: string; batchId: string , role:string}) =>
      assignExamToBatch(examId, batchId , role),
    onSuccess: (_, variables) => {
      toast.success('Exam assigned successfully!');
      queryClient.invalidateQueries({
        queryKey: ['exam-questions', variables.batchId],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to assign exam';
      toast.error(message);
    },
  });
};

export const useGetExamQuestions = (examId: string) => {
  return useQuery({
    queryKey: ['exam-questions', examId],
    queryFn: () => getExamQuestions(examId),
    enabled: !!examId,
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      examId,
      questionId,
      question,
    }: {
      examId: string;
      questionId: string;
      question: any;
    }) => updateQuestion(examId, questionId, question),
    onSuccess: (_, variables) => {
      toast.success('Question updated successfully!');
      queryClient.invalidateQueries({
        queryKey: ['exam-questions', variables.examId],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update question';
      toast.error(message);
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({examId, questionId}: {examId: string; questionId: string}) =>
      deleteQuestion(examId, questionId),
    onSuccess: (_, variables) => {
      toast.success('Question deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: ['exam-questions', variables.examId],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to delete question';
      toast.error(message);
    },
  });
};

export const useGetExamReview=(examId:string,role:string)=>{
  return useQuery({
    queryKey: ['exam-review', examId],
    queryFn: () => getExamReview(examId,role),
    enabled: !!examId,
  });
}

export const useAddRemarks=()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, remarks , role}: {id: string; remarks: string , role:string}) =>
      saveRemark(id, remarks , role),
    onSuccess: () => {
      toast.success('Remarks added successfully!');
      queryClient.invalidateQueries({
        queryKey: ['exam-review'],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to add remarks';
      toast.error(message);
    },
  });
}