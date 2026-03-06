import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useCreateDepartment = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: createDepartment,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] })
            navigate(PrivateRoutes.DEPARTMENTS);
        },
    });

    return { isLoading, error, create: mutate }
}