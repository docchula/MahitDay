import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ account, profile }: { account: any; profile?: any }) {
      if (account.provider === 'google') {
        return profile?.email_verified;
      }
      return true;
    },
  },
};
export default NextAuth(authOptions);
