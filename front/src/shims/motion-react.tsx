// Minimal no-op shim for `framer-motion` to avoid TypeScript/typing issues
// in environments where library types conflict with the project's React version.

// @ts-nocheck
import React from "react";

const noopComponent = (props: any) => props.children ?? null;
const handler = { get: () => noopComponent };
const motion: any = new Proxy({}, handler);

export const AnimatePresence: any = noopComponent;
export default motion;
