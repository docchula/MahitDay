import { Button, Center, List, Paper } from '@mantine/core';
import Link from 'next/link';
import Layout from '../../components/layout';

export default function index() {
  return (
    <>
      <Layout>
        <Center h={350} style={{ flexDirection: 'column' }}>
          <Paper shadow="sm" p="xl" radius="md" m="sm" withBorder>
            วิธีการสมัคร การสมัครเข้าร่วมแข่งประกอบด้วยขั้นตอนต่าง ๆ ดังนี้
            <List type="ordered">
              <List.Item>ยืนยันว่ารับทราบและยอมรับข้อตกลงเกี่ยวกับการแข่งขัน</List.Item>
              <List.Item>กรอกข้อมูลโรงเรียน</List.Item>
              <List.Item>กรอกข้อมูลผู้สมัครแต่ละทีม</List.Item>
              <List.Item>ชำระค่าสมัครแต่ละทีมแยกกันและอัปโหลดหลักฐานการชำระเงิน</List.Item>
              <List.Item>ตรวจสอบสถานะการสมัคร</List.Item>
              <List.Item>พิมพ์ใบสมัคร</List.Item>
            </List>
            <Center>
              <Link href="/dashboard/step1" passHref>
                <Button
                  variant="gradient"
                  gradient={{ from: '#d85b61', to: '#f49fa1' }}
                  size="xl"
                  radius="lg"
                  mt="md"
                >
                  เริ่มต้นการสมัคร
                </Button>
              </Link>
            </Center>
          </Paper>
        </Center>
      </Layout>
    </>
  );
}
