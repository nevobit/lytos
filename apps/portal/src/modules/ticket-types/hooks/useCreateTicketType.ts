import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicketType } from "../services";

export const useCreateTicketType = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isLoading, error } = useMutation({
        mutationFn: createTicketType,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketTypes'] });
        },
    });

    return { create: mutateAsync, isLoading, error };
};
