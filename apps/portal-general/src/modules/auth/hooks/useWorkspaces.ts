

import { useQuery } from "@tanstack/react-query";
import { workspaces } from "../services";

export const useWorkspaces = () => {
    const { isPending: isLoading, data, } = useQuery({
        queryKey: ['workspaces'],
        queryFn: workspaces,
    });
    return { isLoading, workspaces: data }
}