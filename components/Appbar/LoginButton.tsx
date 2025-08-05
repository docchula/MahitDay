import { Button } from '@mantine/core';
import { IconLogin, IconLogout } from '@tabler/icons-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Button variant="subtle" type="button" onClick={() => signOut()}>
          <IconLogout />
        </Button>
      </>
    );
  }
  return (
    <>
      <Button variant="subtle" type="button" onClick={() => signIn()}>
        <IconLogin />
      </Button>
    </>
  );
}
