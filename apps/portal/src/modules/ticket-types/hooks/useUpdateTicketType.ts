import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketType } from "../services";

export const useUpdateTicketType = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isLoading, error } = useMutation({
        mutationFn: updateTicketType,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticketTypes'] });
        },
    });

    return { update: mutateAsync, isLoading, error };
};
