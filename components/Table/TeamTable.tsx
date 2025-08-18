import { useEffect, useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { MAX_TEAM, RESERVED_TEAM } from '../../utils/config';

interface TeamData {
  id: number;
  name: string;
  email: string;
  team_code: number;
  teacher_prefix: string;
  teacher_firstname: string;
  teacher_lastname: string;
  teacher_phone: string;
  enrollment_status: number;
  team_reference: string;
  created_at: string;
  confirmed_at?: string;
}

export default function UserTable() {
  const [data, setData] = useState<TeamData[]>([]);
  useEffect(() => {
    fetch('/api/admin/teams')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.json();
      })
      .then((response) => {
        const teams: TeamData[] = response.data;
        const registeredTeams = teams
          .filter((team) => team.enrollment_status !== 0)
          .sort(
            (a, b) =>
              new Date(a.confirmed_at ?? a.created_at).getTime() -
              new Date(b.confirmed_at ?? b.created_at).getTime()
          );
        const actualTeamLimit = MAX_TEAM - RESERVED_TEAM;
        const teamsWithSlot = teams.map((team) => {
          const regIndex = registeredTeams.findIndex(
            (t) => t.team_reference === team.team_reference
          );
          let team_slot: number | string = '-';
          if (team.enrollment_status !== 0 && regIndex !== -1) {
            if (regIndex < actualTeamLimit) {
              team_slot = 0;
            } else if (regIndex >= actualTeamLimit && regIndex < actualTeamLimit + RESERVED_TEAM) {
              team_slot = regIndex - actualTeamLimit + 1;
            }
          }
          return { ...team, team_slot };
        });
        setData(teamsWithSlot);
      });
  }, []);

  const actualTeamLimit = MAX_TEAM - RESERVED_TEAM;

  const registeredTeams = useMemo(
    () =>
      data
        .filter((team) => team.enrollment_status !== 0)
        .sort(
          (a, b) =>
            new Date(a.confirmed_at ?? a.created_at).getTime() -
            new Date(b.confirmed_at ?? b.created_at).getTime()
        ),
    [data]
  );

  const columns = useMemo<MRT_ColumnDef<TeamData>[]>(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'team_code', header: 'Team Code' },
      { accessorKey: 'teacher_prefix', header: 'Teacher Prefix' },
      { accessorKey: 'teacher_firstname', header: 'Teacher Firstname' },
      { accessorKey: 'teacher_lastname', header: 'Teacher Lastname' },
      { accessorKey: 'teacher_phone', header: 'Teacher Phone' },
      { accessorKey: 'enrollment_status', header: 'Enrollment Status' },
      {
        accessorKey: 'team_slot',
        header: 'Team Slot',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
      },
      {
        accessorKey: 'confirmed_at',
        header: 'Confirmed At',
        Cell: ({ cell }) =>
          cell.getValue<string>() ? new Date(cell.getValue<string>()).toLocaleString() : '-',
      },
      { accessorKey: 'team_reference', header: 'Team Reference' },
    ],
    [registeredTeams]
  );

  const table = useMantineReactTable({
    columns,
    data,
  });

  return <MantineReactTable table={table} />;
}
