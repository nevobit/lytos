import { useQuery } from "@tanstack/react-query";
import { fetchInvitations } from "../services";

export const useInvitations = () => {
    const { isPending: isLoading, data } = useQuery({
        queryKey: ['invitations'],
        queryFn: fetchInvitations,
    });
    return { isLoading, invitations: data };
};
