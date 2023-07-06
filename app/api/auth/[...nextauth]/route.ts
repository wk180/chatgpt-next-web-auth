import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
import { Client as FaunaClient } from "faunadb";
import { FaunaAdapter } from "@auth/fauna-adapter";
import type { Adapter } from "next-auth/adapters";

interface wechatProfile extends Record<string, any> {
  id: string;
}

const client = new FaunaClient({
  secret: process.env.FAUNA_SECRET ?? "",
  scheme: "https",
  domain: "db.fauna.com",
});

// const prisma = new PrismaClient();

const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma) as Adapter,
  adapter: FaunaAdapter(client) as Adapter,
  // pages: {
  //   signIn: "/signin",
  // },
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "wechat",
      name: "微信",
      type: "oauth",
      clientId: process.env.WEIXIN_CLIENT_ID,
      clientSecret: process.env.WEIXIN_SECRET,
      client: { token_endpoint_auth_method: "client_secret_post" },
      authorization: {
        url: "https://wxauth.qiuqian.ren/oauth2/authorize",
        params: { scope: "snsapi_base" },
      },
      token: "https://wxauth.qiuqian.ren/oauth2/token",
      userinfo: {
        url: "https://wxauth.qiuqian.ren/oauth2/profile",
        async request({ tokens, client, provider }) {
          return await client.userinfo(tokens.access_token!, {});
        },
      },
      profile(profile: wechatProfile) {
        console.log(profile);
        return {
          id: profile.id,
          name: profile.id,
          email: null,
        };
      },
      style: {
        logo: "/facebook.svg",
        logoDark: "/facebook-dark.svg",
        bg: "#fff",
        text: "#006aff",
        bgDark: "#006aff",
        textDark: "#fff",
      },
    },
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
