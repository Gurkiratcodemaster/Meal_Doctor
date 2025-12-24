import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



// 522270356007-u1ie2a61u9d55tnhjqrmf54em82rv12h.apps.googleusercontent.com

// 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