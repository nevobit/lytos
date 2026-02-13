import { useQuery } from "@tanstack/react-query";
import { tickets } from "../services";

export const useTickets = () => {
    const { isPending: isLoading, data, } = useQuery({
        queryKey: ['tickets'],
        queryFn: tickets,
    });

    return { isLoading, tickets: data }
}