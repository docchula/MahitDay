import { Badge, Box, Button, Card, Container, Modal, Space, Table, Text } from '@mantine/core';
import { useState } from 'react';
import useSWR from 'swr';
import { useDisclosure } from '@mantine/hooks';
import Layout from '../../components/layout';
import AlertBadge from '../../components/AlertBadge/AlertBadge';
import LoadingPlaceholder from '../../components/Placeholder/LoadingPlaceholder';
import { useStatus } from '../../hooks/status';
import CertificateGenerator from '../../components/Certificate/CertificateGenerator';

interface Team {
  enrollment_status: number;
  team_reference: string;
  name: string;
  student1: Student;
  student2: Student;
}
interface Student {
  prefix: string;
  firstname: string;
  lastname: string;
  student_score: number | null;
  national_id: string;
}

export default function index() {
  const { data } = useSWR('/api/team-score');
  const { isAgree } = useStatus();

  const nullStudent = {
    prefix: '',
    firstname: '-',
    lastname: '-',
    student_score: null,
    national_id: '-',
  };

  const [student1, setStudent1] = useState<Student>(nullStudent);
  const [student2, setStudent2] = useState<Student>(nullStudent);

  const [opened, { open, close }] = useDisclosure(false);

  const handleClick = (s1: Student, s2: Student) => {
    open();
    setStudent1(s1 || nullStudent);
    setStudent2(s2 || nullStudent);
  };

  const rows = Array.isArray(data)
    ? data.map((team: Team) => (
        <tr key={team.team_reference}>
          <td>{team.name}</td>
          <td style={{ textAlign: 'right' }}>
            {(() => {
              switch (team.enrollment_status) {
                case 4:
                  return (
                    <Button
                      color="green"
                      onClick={() =>
                        handleClick(team.student1, team.student2)
                      }
                    >
                      พิมพ์เกียรติบัตร
                    </Button>
                  );
                default:
                  return (
                    <Badge color="blue" size="xl" variant="filled">
                      ยังไม่เปิดระบบ
                    </Badge>
                  );
              }
            })()}
          </td>
        </tr>
      ))
    : [];
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
        <Container size="lg" px="xs">
          {data !== null ? (
            <>
              <Box sx={{ borderRadius: 3, overflow: 'auto' }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fz="xl">พิมพ์เกียรติบัตร</Text>
                  <Box sx={{ overflow: 'auto' }}>
                    <Table verticalSpacing="xs" withBorder>
                      <tbody>{rows}</tbody>
                    </Table>
                  </Box>
                </Card>
              </Box>
            </>
          ) : (
            <AlertBadge title="คำเตือน" color="yellow" description="ไม่มีข้อมูลผู้สมัคร" />
          )}
          <Space h="sm" />
          <Modal
            opened={opened}
            onClose={close}
            title="พิมพ์เกียรติบัตร"
            size="lg"
            centered
          >
            <Space h="sm" />
            <CertificateGenerator student1={student1} student2={student2} />
          </Modal>
        </Container>
      </Layout>
    </>
  );
}
