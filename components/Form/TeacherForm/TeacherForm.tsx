import { Box, Input, TextInput, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface TeacherFormProps {
  prefix: { value: string };
  firstname: { value: string };
  lastname: { value: string };
  phone: { value: string };
}

export default function TeacherForm(props: TeacherFormProps) {
  return (
    <>
      <Box>
        <Text>คำนำหน้าชื่อ</Text>
        <Input
          component="select"
          rightSection={<IconChevronDown size={14} stroke={1.5} />}
          {...props.prefix}
        >
          <option value="">-</option>
          <option value="นาย">นาย</option>
          <option value="นาง">นาง</option>
          <option value="นางสาว">นางสาว</option>
        </Input>
        <TextInput label="ชื่อ" placeholder="ชื่อ" mt="md" {...props.firstname} />
        <TextInput label="นามสกุล" placeholder="นามสกุล" mt="md" {...props.lastname} />
        <TextInput label="โทรศัพท์" placeholder="0812345678" mt="md" {...props.phone} />
      </Box>
    </>
  );
}
