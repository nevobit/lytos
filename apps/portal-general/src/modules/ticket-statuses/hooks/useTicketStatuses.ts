import { useQuery } from "@tanstack/react-query";
import { ticketStatuses } from "../services";

export const useTicketStatuses = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['ticketStatuses'],
        queryFn: ticketStatuses,
    });
    return { ticketStatuses: data || { items: [] }, isLoading, error };
};
