import { useQuery } from "@tanstack/react-query";
import { departments } from "../services";

export const useDepartments = () => {
    const { isPending: isLoading, data, } = useQuery({
        queryKey: ['departments'],
        queryFn: departments,
    });
    return { isLoading, departments: data }
}