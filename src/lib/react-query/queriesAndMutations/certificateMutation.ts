import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { generateCertificateApi, getCertificatesApi, GenerateCertificatePayload } from "@/lib/api/admin/certificateApi";

export const useGenerateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, studentId,role }: { payload: FormData | GenerateCertificatePayload; studentId:string ;role?: string }) =>
      generateCertificateApi(payload, studentId, role),
    onSuccess: () => {
      toast.success("Certificate generated and submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to generate certificate";
      toast.error(message);
    },
  });
};

export const useGetCertificates = (batchId?: string, role?: string) => {
  return useQuery({
    queryKey: ["certificates", batchId, role],
    queryFn: () => getCertificatesApi(batchId, role),
    enabled: Boolean(role),
  });
};
