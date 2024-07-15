// src/utils/auth.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function requireAuth(ctx) {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    if (!session) {
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
        return { props: {} };
    }
    return { props: { session } };
}
