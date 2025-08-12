import React from 'react';
import { useForm } from '@mantine/form';
import { Button, TextInput, Text } from '@mantine/core';
import { signIn } from 'next-auth/react';

export type Props = {
  redirect?: string;
};

export const CredentialSignin: React.FC<Props> = ({ redirect }) => {
  const form = useForm({
    initialValues: {
      name: 'Batman Bin Suparman',
      email: 'batman.suparman@docchula.com',
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        signIn('credentials', { redirect: Boolean(redirect), callbackUrl: redirect, ...values });
      })}
    >
      <Text size="lg" weight={500}>
        Login for Development/Testing purposes only.
      </Text>

      <TextInput withAsterisk label="Name" {...form.getInputProps('name')} />
      <TextInput withAsterisk label="Email" {...form.getInputProps('email')} />

      <Button type="submit">Submit</Button>
    </form>
  );
};
