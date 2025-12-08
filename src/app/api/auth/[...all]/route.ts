import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Expose les méthodes GET et POST du handler de better-auth
export const { GET, POST } = toNextJsHandler(auth.handler);