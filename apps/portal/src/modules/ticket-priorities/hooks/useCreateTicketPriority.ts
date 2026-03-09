import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicketPriority } from "../services";

export const useCreateTicketPriority = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: createTicketPriority,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketPriorities'] });
        },
    });

    // return the async version so callers can await the created object
    return { isLoading, error, create: mutateAsync };
};