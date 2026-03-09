import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicketPriority } from "../services";

export const useDeleteTicketPriority = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: deleteTicketPriority,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketPriorities'] });
        },
    });

    return { isLoading, error, remove: mutate };
};