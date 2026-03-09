import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketPriority } from "../services";

export const useUpdateTicketPriority = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: updateTicketPriority,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketPriorities'] });
        },
    });

    return { isLoading, error, update: mutate };
};