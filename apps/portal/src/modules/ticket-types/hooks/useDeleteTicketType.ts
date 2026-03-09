import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicketType } from "../services";

export const useDeleteTicketType = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: deleteTicketType,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketTypes'] });
        },
    });

    return { remove: mutateAsync, isLoading: isPending, error };
};
