

import { useQuery } from "@tanstack/react-query";
import { users } from "../services";

export const useUsers = () => {
    const { isPending: isLoading, data, } = useQuery({
        queryKey: ['users'],
        queryFn: users,
    });
    return { isLoading, users: data }
}