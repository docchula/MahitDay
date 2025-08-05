import { Center, Divider, List, Text, Image } from '@mantine/core';

interface PaymentFormProps {
  teamPrice: number;
  purposeText: string;
}

export default function PaymentInfo({ teamPrice, purposeText }: PaymentFormProps) {
  return (
    <>
      <Center>
        <Text fz="lg">โอนเงินผ่านทางธนาคารหรือ QR Code</Text>
      </Center>
      <Divider my="sm" />
      <List>
        <List.Item>
          ชื่อบัญชี การแข่งขันตอบปัญหาทางชีววิทยาและวิทยาศาสตร์การแพทย์ ปี 2568
        </List.Item>
        <List.Item>ธนาคารกสิกรไทย</List.Item>
        <List.Item>เลขที่บัญชี 211-2-72360-1</List.Item>
        <Divider my="sm" />
      </List>
      <Center style={{ display: 'flex', flexDirection: 'column' }}>
        <Image
          src={`/qrcode-2025.jpg`}
          alt="Payment QR code"
          style={{
            maxWidth: '70%',
            width: '100%',
            height: 'auto',
          }}
        />
        <h1 style={{ textAlign: 'center' }}>
          ค่าสมัครเข้า{purposeText} จำนวนเงิน <span style={{ color: '#c92a2a' }}>{teamPrice}</span>{' '}
          บาท
        </h1>
      </Center>
    </>
  );
}
