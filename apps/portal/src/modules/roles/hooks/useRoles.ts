import { useQuery } from "@tanstack/react-query";
import { roles } from "../services";

export const useRoles = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['roles'],
        queryFn: roles,
    });
    return { roles: data || { items: [] }, isLoading, error };
};
