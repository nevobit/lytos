import { withPrefix } from "@lytos/constant-definitions";
import { listRolesRoute } from "./list";
import { createRoleRoute } from "./create";
import { updateRoleRoute } from "./update";
import { deleteRoleRoute } from "./delete";

export const roleRoutes = withPrefix("/roles", [
    listRolesRoute,
    createRoleRoute,
    updateRoleRoute,
    deleteRoleRoute,
]);
