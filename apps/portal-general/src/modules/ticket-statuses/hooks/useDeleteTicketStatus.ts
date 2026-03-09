import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicketStatus } from "../services";

export const useDeleteTicketStatus = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutateAsync, error } = useMutation({
        mutationFn: deleteTicketStatus,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketStatuses'] });
        },
    });

    return { isLoading, error, remove: mutateAsync };
};
