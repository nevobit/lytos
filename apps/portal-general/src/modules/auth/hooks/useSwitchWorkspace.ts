import { useSession } from "@/shared";
import { useMutation } from "@tanstack/react-query";
import { switchWorkspace } from "../services";

export const useSwitchWorkspace = () => {
    const globalToken = useSession((s) => s.globalToken);
    const setWorkspaceContext = useSession((s) => s.setWorkspaceContext);

    if (!globalToken) throw new Error("Missing global token");

    const { isPending: isLoading, mutate } = useMutation({
        mutationFn: switchWorkspace,
        onSuccess: async (data) => {
            setWorkspaceContext({
                workspaceToken: data.accessToken,
                membershipId: data.membershipId,
                workspace: data.workspace
            })
        }
    });

    return { switchWorkspace: mutate, isLoading };
};
