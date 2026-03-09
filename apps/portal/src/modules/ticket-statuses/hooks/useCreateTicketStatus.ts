import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicketStatus } from "../services";

export const useCreateTicketStatus = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: createTicketStatus,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketStatuses'] });
        },
    });

    return { isLoading, error, create: mutateAsync };
};
