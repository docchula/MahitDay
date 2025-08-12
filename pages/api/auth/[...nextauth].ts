import NextAuth, { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Only enable credentials for internal development/testing use
    ...(process.env.DEV_ENABLE_CREDENTIAL_LOGIN
      ? [
          CredentialsProvider({
            name: 'Internal Development Use Only',
            credentials: {
              name: { label: 'Name', type: 'text', placeholder: 'Batman Bin Suparman' },
              email: { label: 'Email', type: 'text', placeholder: 'batman.suparman@docchula.com' },
            },
            authorize: async (
              credentials: Record<string, string> | undefined
            ): Promise<User | null> => {
              // Hash to create a consistent (yet random looking) ID for testing purposes.
              const { createHash } = await import('node:crypto');
              const md5 = createHash('md5');
              md5.update(credentials?.email ?? credentials?.name ?? Math.random().toString());

              return {
                id: md5.digest('base64url'),
                name: credentials?.name,
                email: credentials?.email,
              };
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!account) return false;

      if (account.provider === 'google') {
        return (profile as GoogleProfile)?.email_verified;
      }

      if (account.provider === 'credentials' && process.env.DEV_ENABLE_CREDENTIAL_LOGIN) {
        // Enable credentials only when DEV_ENABLE_CREDENTIAL_LOGIN is set
        return true;
      }

      return false;
    },
  },
};
export default NextAuth(authOptions);
