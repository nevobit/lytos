import { useQuery } from "@tanstack/react-query";
import { ticketTypes } from "../services";

export const useTicketTypes = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['ticketTypes'],
        queryFn: ticketTypes,
    });

    return { ticketTypes: data || { items: [] }, isLoading, error };
};
