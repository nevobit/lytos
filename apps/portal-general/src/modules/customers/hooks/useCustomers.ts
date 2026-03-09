import { useQuery } from "@tanstack/react-query";
import { customers } from "../services";

export const useCustomers = () => {
    const { isPending: isLoading, data, } = useQuery({
        queryKey: ['customers'],
        queryFn: customers,
    });

    return { isLoading, customers: data }
}