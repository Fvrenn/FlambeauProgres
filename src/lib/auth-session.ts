import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
export const getUser = async () =>{
     "use server";
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session?.user;
}