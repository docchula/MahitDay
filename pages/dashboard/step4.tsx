import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Loader,
  LoadingOverlay,
  Modal,
  Space,
  Table,
  Text,
} from '@mantine/core';
import { Suspense, lazy, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDisclosure } from '@mantine/hooks';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout';
import PaymentForm from '../../components/Form/PaymentForm/PaymentForm';
import AlertBadge from '../../components/AlertBadge/AlertBadge';
import LoadingPlaceholder from '../../components/Placeholder/LoadingPlaceholder';
import StatusConverter from '../../components/StatusConverter/StatusConverter';
import { useRegisterStatus, useStatus } from '../../hooks/status';
import { ALLOW_CERTIFICATE_PRINTING } from '../../utils/config';

const TicketGenerator = lazy(() => import('../../components/PdfIdCard/TicketGenerator'));

interface User {
  team_reference: string;
  name: string;
  total_payment: number;
  enrollment_status: number;
}

export default function index() {
  const { data } = useSWR('/api/register-team');
  const { isAvailable } = useRegisterStatus();
  const [teamPrice, setTeamPrice] = useState(0);
  const [teamRef, setTeamRef] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, setVisible] = useState(false);

  const handleStatusChange = async (teamRef: string) => {
    const confirmed = window.confirm(
      'ต้องการยืนยันการสมัครหรือไม่ คุณจะไม่สามารถแก้ไขได้หลังจากยืนยันแล้ว'
    );
    if (!confirmed) return;

    try {
      const response = await fetch('/api/change-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_reference: teamRef }),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        // Refresh the page or update the data to show the new status
        toast.success('อัปเดตสถานะสำเร็จ กรุณารีเฟรชหน้าจอ', {
          position: 'bottom-right',
          theme: 'colored',
        });
        // You might want to revalidate the SWR data here
      } else {
        toast.error('เกิดข้อผิดพลาด', {
          position: 'bottom-right',
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', {
        position: 'bottom-right',
        theme: 'colored',
      });
    }
  };

  const notify = () =>
    toast.success('ส่งหลักฐานสำเร็จ กรุณาตรวจผลการตรวจสอบในภายหลัง', {
      position: 'bottom-right',
      theme: 'colored',
    });
  const handleClick = (price: number, ref: string) => {
    open();
    setTeamPrice(price);
    setTeamRef(ref);
  };
  const rows = Array.isArray(data)
    ? data.map((user: User) => (
        <tr key={user.team_reference}>
          <td>{user.name}</td>
          <td style={{ textAlign: 'right' }}>
            {(() => {
              switch (user.enrollment_status) {
                case 0:
                  return (
                    <>
                      {isAvailable ? (
                        <Button
                          onClick={() => handleStatusChange(user.team_reference)}
                          sx={{
                            backgroundColor: '#d49559',
                            color: 'white',
                            '&:hover': { backgroundColor: '#716FD0' },
                          }}
                        >
                          ยืนยันการสมัคร
                        </Button>
                      ) : (
                        <Badge color="orange" size="xl" variant="filled">
                          ปิดรับสมัคร
                        </Badge>
                      )}
                    </>
                  );
                case 4:
                  return (
                    <Suspense fallback={<Loader size="sm" mx="auto" />}>
                      <TicketGenerator
                        team_reference={user.team_reference}
                        toggleLoader={setVisible}
                      />
                    </Suspense>
                  );
                default:
                  return <StatusConverter statusNumber={user.enrollment_status} />;
              }
            })()}
          </td>
        </tr>
      ))
    : [];
  const { isAgree } = useStatus();

  const router = useRouter();

  useEffect(() => {
    if (ALLOW_CERTIFICATE_PRINTING) {
      router.push('/dashboard/step5');
    }
  }, [router]);

  if (data?.status === 'no team registered found') {
    return (
      <>
        <Layout>
          <AlertBadge
            title="คำเตือน"
            color="red"
            description="ไม่พบข้อมูลทีม กรุณาเข้าสู่ระบบด้วยอีเมลเดิมที่ใช้สมัครสอบ"
          />
        </Layout>
      </>
    );
  }

  if (isAgree === undefined || isAgree === false) {
    return (
      <>
        <Layout>
          <LoadingPlaceholder />
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <Container size="lg" px="xs">
          {data !== null ? (
            <>
              <Box sx={{ borderRadius: 3, overflow: 'auto' }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fz="xl">ทีม</Text>
                  <Box sx={{ overflow: 'auto' }}>
                    <Table verticalSpacing="xs" withBorder>
                      <tbody>{rows}</tbody>
                    </Table>
                  </Box>
                </Card>
              </Box>
            </>
          ) : (
            <AlertBadge title="คำเตือน" color="yellow" description="ยังไม่มีข้อมูลผู้สมัคร" />
          )}
          <Space h="sm" />
          <Modal
            opened={opened}
            onClose={close}
            title="อัปโหลดหลักฐานการโอนเงิน"
            size="lg"
            centered
          >
            <PaymentForm teamPrice={teamPrice} teamRef={teamRef} close={close} notify={notify} />
          </Modal>
        </Container>
      </Layout>
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}
