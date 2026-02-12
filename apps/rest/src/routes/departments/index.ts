import { withPrefix } from "@lytos/constant-definitions";
import { listDepartmentsRoute } from "./list";
import { createDepartmentRoute } from "./create";
import { updateDepartmentRoute } from "./update";
import { setDefaultDepartmentRoute } from "./set-default";
import { deleteDepartmentRoute } from "./delete";

export const departmentRoutes = withPrefix("/departments", [
    listDepartmentsRoute,
    createDepartmentRoute,
    updateDepartmentRoute,
    setDefaultDepartmentRoute,
    deleteDepartmentRoute,
]);