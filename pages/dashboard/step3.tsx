import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Collapse,
  Container,
  Skeleton,
  Space,
  Table,
  Text,
} from '@mantine/core';
import useSWR from 'swr';
import Layout from '../../components/layout';
import DeleteTeamButton from '../../components/Form/TeamForm/DeleteTeamButton';
import AddTeamForm from '../../components/Form/TeamForm/AddTeamForm';
import AlertBadge from '../../components/AlertBadge/AlertBadge';
import EditTeamForm from '../../components/Form/TeamForm/EditTeamForm';
import LoadingPlaceholder from '../../components/Placeholder/LoadingPlaceholder';
import StatusConverter from '../../components/StatusConverter/StatusConverter';
import { useRegisterStatus, useStatus } from '../../hooks/status';

interface Team {
  id: number;
  name: string;
  email: string;
  enrollment_status: number;
  team_reference: string;
}
export default function index() {
  const [openedTeamForm, setOpenedTeamForm] = useState(false);
  const [openedEditTeamForm, setOpenedEditTeamForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const { isAvailable } = useRegisterStatus();
  const handleRegister = () => {
    setOpenedEditTeamForm(false);
    setOpenedTeamForm(!openedTeamForm);
  };
  const handleEdit = (ref: number) => {
    setOpenedTeamForm(false);
    setSelectedTeam(ref);
    setOpenedEditTeamForm(true);
  };
  const { data, isLoading } = useSWR('/api/register-team');
  const rows = Array.isArray(data)
    ? data.map((user: Team, ref: number) => (
        <tr
          key={user.id}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <td>{user.name}</td>
          <td>
            {user.enrollment_status === 0 ? (
              <>
                {isAvailable && (
                  <span style={{ display: 'flex' }}>
                    <Button
                      color="orange"
                      onClick={() => handleEdit(ref)}
                      style={{ marginRight: '0.5em' }}
                    >
                      แก้ไข
                    </Button>
                    <DeleteTeamButton teamReference={user.team_reference} />
                  </span>
                )}
              </>
            ) : (
              <StatusConverter statusNumber={user.enrollment_status} />
            )}
          </td>
        </tr>
      ))
    : [];
  const { isAgree } = useStatus();
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
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fz="xl">ทีม</Text>
            {data !== null ? (
              <Box sx={{ borderRadius: 3, overflow: 'auto' }}>
                {isLoading ? (
                  <Skeleton h={150} />
                ) : (
                  <Table verticalSpacing="xs" withBorder>
                    <tbody>{rows}</tbody>
                  </Table>
                )}
              </Box>
            ) : (
              <AlertBadge title="คำเตือน" color="yellow" description="ยังไม่มีข้อมูลผู้สมัคร" />
            )}
          </Card>
          {isAvailable && (
            <>
              <Space h="sm" />
              <Button
                onClick={handleRegister}
                sx={{
                  backgroundColor: '#d49559',
                  color: 'white',
                  '&:hover': { backgroundColor: '#716FD0' },
                }}
              >
                เพิ่มทีม
              </Button>
              <Space h="md" />
              <Collapse in={openedTeamForm} transitionDuration={500}>
                <AddTeamForm />
              </Collapse>
              <Collapse in={openedEditTeamForm} transitionDuration={500}>
                <EditTeamForm selectedTeam={selectedTeam} />
              </Collapse>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
