import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatus } from "../services";

export const useUpdateTicketStatus = () => {
    const queryClient = useQueryClient();

    const { isPending: isLoading, mutate, error } = useMutation({
        mutationFn: updateTicketStatus,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketStatuses'] });
        },
    });

    return { isLoading, error, update: mutate };
};
