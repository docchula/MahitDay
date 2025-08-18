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
import { RESERVED_TEAM, MAX_TEAM } from '@/utils/config';

interface Team {
  id: number;
  name: string;
  email: string;
  enrollment_status: number;
  team_reference: string;
  created_at: string;
  confirmed_at?: string
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

  // Sort and filter teams that are not enrollment_status 0 (unconfirmed)
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

  const rows = Array.isArray(data)
    ? data.map((user: Team) => {
        // Find the team's index in the sorted list of confirmed teams
        const regIndex = registeredTeams.findIndex(
          (t) => t.team_reference === user.team_reference,
        );

        let statusElement;
        if (user.enrollment_status === 0) {
          statusElement = (
            <>
              {isAvailable && (
                <span style={{ display: 'flex' }}>
                  <Button
                    color="orange"
                    onClick={() => handleEdit(user.id)}
                    style={{ marginRight: '0.5em' }}
                  >
                    แก้ไข
                  </Button>
                  <DeleteTeamButton teamReference={user.team_reference} />
                </span>
              )}
            </>
          );
        } else if (regIndex !== -1 && regIndex < actualTeamLimit) {
          // Regular confirmed team (within the main limit)
          statusElement = <StatusConverter statusNumber={user.enrollment_status} />;
        } else if (
          regIndex !== -1 &&
          regIndex >= actualTeamLimit &&
          regIndex < actualTeamLimit + RESERVED_TEAM
        ) {
          // Reserved team
          statusElement = (
            <StatusConverter
              statusNumber={user.enrollment_status}
              reservedOrder={regIndex - actualTeamLimit + 1}
            />
          );
        } else {
          // Fallback for other statuses
          statusElement = <StatusConverter statusNumber={user.enrollment_status} />;
        }
        return (
          <tr
            key={user.id}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <td>{user.name}</td>
            <td>{statusElement}</td>
          </tr>
        );
      })
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