import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket } from "../services";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/app/router/routes";

export const useCreateTicket = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: createTicket,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] })
            navigate(PrivateRoutes.TICKETS);
        },
    });

    return { isLoading, error, create: mutate }
}