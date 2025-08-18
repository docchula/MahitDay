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
import { ALLOW_CERTIFICATE_PRINTING, RESERVED_TEAM, MAX_TEAM } from '../../utils/config';

const TicketGenerator = lazy(() => import('../../components/PdfIdCard/TicketGenerator'));

interface Team {
  id: number;
  name: string;
  email: string;
  enrollment_status: number;
  team_reference: string;
  created_at: string;
  confirmed_at?: string; // ADD THIS LINE
}

export default function index() {
  const { data } = useSWR('/api/register-team');
  const { isAvailable } = useRegisterStatus();
  const [teamPrice, setTeamPrice] = useState(0);
  const [teamRef, setTeamRef] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, setVisible] = useState(false);

  // Sort and filter teams based on confirmation time
  const registeredTeams = Array.isArray(data)
    ? data
        .filter((team: Team) => team.enrollment_status !== 0)
        .sort(
          (a: Team, b: Team) =>
            new Date(a.confirmed_at ?? '').getTime() -
            new Date(b.confirmed_at ?? '').getTime(),
        )
    : [];

  const actualTeamLimit = MAX_TEAM - RESERVED_TEAM;

  const handleStatusChange = async (teamRef: string) => {
    const confirmed = window.confirm(
      'ต้องการยืนยันการสมัครหรือไม่ คุณจะไม่สามารถแก้ไขได้หลังจากยืนยันแล้ว',
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
    ? data.map((user: Team) => {
        // Find the team's rank in the confirmed teams list
        const regIndex = registeredTeams.findIndex(
          (t) => t.team_reference === user.team_reference,
        );
        let statusElement;
        if (user.enrollment_status === 0) {
          statusElement = (
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
        } else if (user.enrollment_status === 4) {
          statusElement = (
            <Suspense fallback={<Loader size="sm" mx="auto" />}>
              <TicketGenerator team_reference={user.team_reference} toggleLoader={setVisible} />
            </Suspense>
          );
        } else if (regIndex !== -1 && regIndex < actualTeamLimit) {
          // Actual team slot (confirmed, within limit)
          statusElement = <StatusConverter statusNumber={user.enrollment_status} />;
        } else if (
          regIndex !== -1 &&
          regIndex >= actualTeamLimit &&
          regIndex < actualTeamLimit + RESERVED_TEAM
        ) {
          // Reserved team slot (confirmed, after limit)
          statusElement = (
            <StatusConverter
              statusNumber={user.enrollment_status}
              reservedOrder={regIndex - actualTeamLimit + 1}
            />
          );
        } else {
          // Normal team
          statusElement = <StatusConverter statusNumber={user.enrollment_status} />;
        }
        return (
          <tr key={user.team_reference}>
            <td>{user.name}</td>
            <td style={{ textAlign: 'right' }}>{statusElement}</td>
          </tr>
        );
      })
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