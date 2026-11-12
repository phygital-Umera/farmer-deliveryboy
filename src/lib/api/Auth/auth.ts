import { unAuthenticatedApi } from "@/utils/axios";

export const loginFaculty = async (credentials: {
  username?: string;
  // email?: string;
  password: string;
}) => {
  const response = await unAuthenticatedApi.post('/users/login', credentials);
  return response.data;
};

export const registerCustomer=async(data: any)=>{
  const response=await unAuthenticatedApi.post('/users/register',data);
  return response.data;
}