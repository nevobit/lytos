import { useQuery } from "@tanstack/react-query";
import { scalationRules } from "../services";

export const useScalationRules = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['scalationRules'],
        queryFn: scalationRules
    });
    return { scalationRules: data || { items: [] }, isLoading, error };
};
