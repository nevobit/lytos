import { useQuery } from "@tanstack/react-query";
import { ticketCategories } from "../services";

export const useTicketCategories = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['ticketCategories'],
        queryFn: ticketCategories,
    });
    return { ticketCategories: data || { items: [] }, isLoading, error };
};