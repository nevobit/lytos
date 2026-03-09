import { withPrefix } from "@lytos/constant-definitions";
import { listScalationRulesRoute } from "./list";
import { createScalationRuleRoute } from "./create";
import { updateScalationRuleRoute } from "./update";
import { deleteScalationRuleRoute } from "./delete";

export const scalationRuleRoutes = withPrefix("/scalation-rules", [
    listScalationRulesRoute,
    createScalationRuleRoute,
    updateScalationRuleRoute,
    deleteScalationRuleRoute,
]);
