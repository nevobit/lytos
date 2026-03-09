import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useCreateCustomer = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: createCustomer,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            navigate(PrivateRoutes.CUSTOMERS);
        },
    });

    return { isLoading, error, create: mutate }
}