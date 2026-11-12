import { loginFaculty, registerCustomer } from "@/lib/api/Auth/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";

export const useCustomerLogin = () => {
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: loginFaculty,
        onSuccess: (res) => {
            const accessToken = res.data?.accessToken || res?.accessToken;
            const refreshToken = res.data?.refreshToken || res?.refreshToken;
            const userData = res.data?.user || res?.user;

            if (accessToken) {
                login(accessToken, userData, refreshToken);
            }
        },
        onError: (error: Error) => {
            console.error('Error during login:', error.message);
        },
    });
};

export const useCustomerRegister = () => {
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: registerCustomer,
        onSuccess: (res) => {
            const accessToken = res.data?.accessToken || res?.accessToken;
            const refreshToken = res.data?.refreshToken || res?.refreshToken;
            const userData = res.data?.user || res?.user;

            if (accessToken) {
                login(accessToken, userData, refreshToken);
            }
        },
        onError: (error: Error) => {
            console.error('Error during register:', error.message);
        },
    });
};
