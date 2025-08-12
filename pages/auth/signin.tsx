import React from 'react';
import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import { Button, Group, Paper, Text } from '@mantine/core';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import googleLogo from '../../public/google-logo.svg';
import { CredentialSignin } from '../../components/DevelopmentInternals/CredentialSignin';

export const getStaticProps = (async () => ({
  props: {
    enableDevCredentialLogin: Boolean(process.env.DEV_ENABLE_CREDENTIAL_LOGIN),
  },
})) satisfies GetStaticProps;

export default function Login({
  enableDevCredentialLogin = false,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard/info' });
  };
  return (
    <>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
      >
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Text size="lg" weight={500}>
            เข้าสู่ระบบด้วย Google
          </Text>
          <Group grow mt="md" mb="xs">
            <Button onClick={handleLogin}>
              <Image
                src={googleLogo}
                alt="Google Logo"
                width={21}
                height={21}
                style={{ maxHeight: '60%', width: 'auto', paddingRight: '0.5rem' }}
              />{' '}
              เข้าสู่ระบบ
            </Button>
          </Group>
          <Text fz="sm" c="dimmed" size="lg" weight={500}>
            กรุณาเข้าสู่ระบบด้วย Web browser เท่านั้น เช่น Google Chrome, Safari, Microsoft Edge
            หรือ Firefox
          </Text>

          {enableDevCredentialLogin && (
            <div style={{ marginTop: '2rem' }}>
              <CredentialSignin redirect="/dashboard/info" />
            </div>
          )}
        </Paper>
      </div>
    </>
  );
}
