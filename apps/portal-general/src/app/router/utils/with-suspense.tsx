import { Spinner } from "@lytos/design-system";
import { Suspense, type JSX } from "react";

const withSuspense = (el: JSX.Element) => <Suspense fallback={<Spinner />}> {el} </Suspense>;
export default withSuspense;
