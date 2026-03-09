import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTicketTimeline, createTicketMessage } from "../services";

export const useTicketTimeline = (
    ticketId: string,
    includeInternal = false,
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["ticketTimeline", ticketId, includeInternal],
        queryFn: () => getTicketTimeline(ticketId, { includeInternal }),
    });

    return { timeline: data || [], isLoading, error };
};

export const useCreateTicketMessage = (ticketId: string) => {
    const queryClient = useQueryClient();
    return useMutation(
        (message: { body: string; mode: "public" | "internal"; conversationId?: string }) =>
            createTicketMessage(ticketId, message),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["ticketTimeline", ticketId]);
            },
        },
    );
};
