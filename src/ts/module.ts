// Keep or else Foundry globals like game and Hooks will not resolve
/// <reference types="@dfreds/foundry-types" />

import "../styles/style.scss"; // Keep or else vite will not include this
import { HooksCE } from "./hooks/index.ts";

HooksCE.listen();
