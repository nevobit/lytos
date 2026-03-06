import { withPrefix } from "@lytos/constant-definitions";
import { listUsersRoute } from "./list";

export const userRoutes = withPrefix("/users", [
    listUsersRoute,
]);