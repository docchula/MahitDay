import { Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

export default function ConsentForm() {
  const { data: session } = useSession();
  const [buttonStatus, setButtonStatus] = useState(false);
  const router = useRouter();
  const form = useForm({
    clearInputErrorOnChange: false,
    initialValues: {
      termsOfService: false,
    },
  });
  useEffect(() => {
    setButtonStatus(form.values.termsOfService);
  }, [form.values.termsOfService]);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          agree_to_terms: true,
        }),
      });
      if (!response.ok) {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error(error);
    }
    router.push('/dashboard/step2');
  };
  return (
    <Box maw={300} mx="auto">
      <form onSubmit={(e) => handleSubmit(e)}>
        <Checkbox
          mt="md"
          label="ยอมรับ"
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />
        <Group position="right" mt="md">
          {buttonStatus === true ? (
            <Button type="submit">ต่อไป</Button>
          ) : (
            <Button
              type="submit"
              sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
              data-disabled
              onClick={(event) => event.preventDefault()}
            >
              ต่อไป
            </Button>
          )}
        </Group>
      </form>
    </Box>
  );
}
