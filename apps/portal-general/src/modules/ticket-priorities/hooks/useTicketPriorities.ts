import { useQuery } from "@tanstack/react-query";
import { ticketPriorities } from "../services";

export const useTicketPriorities = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['ticketPriorities'],
        queryFn: ticketPriorities,
    });
    return { ticketPriorities: data || { items: [] }, isLoading, error };
};