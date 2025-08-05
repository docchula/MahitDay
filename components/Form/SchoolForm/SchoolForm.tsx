import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Group,
  Select,
  Skeleton,
  Space,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { province } from '../../../utils/constant-lists';

export default function SchoolForm() {
  const { data: session } = useSession();
  const { data, isLoading } = useSWR('/api/register');
  const form = useForm({
    initialValues: {
      school: '',
      place: '',
      province: '',
      phone: '',
    },

    validate: {
      school: isNotEmpty('กรุณากรอกโรงเรียน'),
      place: isNotEmpty('กรุณากรอกที่อยู่'),
      province: isNotEmpty('กรุณาเลือกจังหวัด'),
      phone: (value: string) =>
        /^\d{9,10}$/.test(value) ? null : 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง',
    },
  });
  useEffect(() => {
    form.setValues({
      school: data?.school || '',
      place: data?.school_location || '',
      province: data?.province || '',
      phone: data?.school_phone_number || '',
    });
  }, [data]);
  const handleSubmit = async (values: {
    school: string;
    place: string;
    province: string;
    phone: string;
  }) => {
    const confirmed = window.confirm('กรุณายืนยัน');
    if (confirmed) {
      try {
        const response = await fetch('/api/register', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session?.user?.email,
            school: values.school,
            school_location: values.place,
            province: values.province,
            school_phone_number: values.phone,
          }),
        });
        if (!response.ok) {
          throw new Error('Form submission failed');
        }
        mutate('/api/register');
        mutate('/api/status');
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <Text>กรอกข้อมูลเกี่ยวกับโรงเรียน</Text>
      <Space h="sm" />
      <Card shadow="sm" padding="lg" radius="md" maw={400} mx="auto" withBorder>
        {isLoading ? (
          <Skeleton h={300} mx="auto" />
        ) : (
          <Box component="form" onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              label="โรงเรียน"
              placeholder="โรงเรียน"
              withAsterisk
              mt="md"
              {...form.getInputProps('school')}
            />
            <Textarea
              label="ที่อยู่"
              placeholder="ที่อยู่"
              withAsterisk
              mt="md"
              {...form.getInputProps('place')}
            />
            <Select
              label="จังหวัด"
              placeholder="จังหวัด"
              withAsterisk
              mt="md"
              searchable
              data={province}
              nothingFound="ไม่พบจังหวัด"
              transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
              {...form.getInputProps('province')}
            />
            <TextInput
              label="โทรศัพท์"
              placeholder="0212345678"
              withAsterisk
              mt="md"
              {...form.getInputProps('phone')}
            />

            <Group position="right" mt="md">
              {data.school ? (
                <Button type="submit" color="orange">
                  แก้ไข
                </Button>
              ) : (
                <Button type="submit">ส่ง</Button>
              )}
            </Group>
          </Box>
        )}
      </Card>
    </>
  );
}
