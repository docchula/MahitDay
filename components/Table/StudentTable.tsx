import { useEffect, useMemo, useState } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';

interface StudentData {
  id: number;
  team_reference: string;
  student_id: string;
  national_id: string;
  prefix: string;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  grade: number;
  is_join_medtalk: boolean;
  medtour_group: string;
  preferred_hand: string;
  student_reference: string;
  student_score: number | null;
}

export default function StudentTable() {
  const [data, setData] = useState<StudentData[]>([]);
  useEffect(() => {
    fetch('/api/admin/students')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.json();
      })
      .then((response) => {
        setData(response.data ?? []);
      });
  }, []);
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<StudentData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'team_reference',
        header: 'Team Reference',
      },
      {
        accessorKey: 'prefix',
        header: 'Prefix',
      },
      {
        accessorKey: 'firstname',
        header: 'First Name',
      },
      {
        accessorKey: 'lastname',
        header: 'Last Name',
      },
      {
        accessorKey: 'national_id',
        header: 'National ID',
      },
      {
        accessorKey: 'student_id',
        header: 'Student ID',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
      },
      {
        accessorKey: 'is_join_medtalk',
        header: 'Medtalk',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
      },
      {
        accessorKey: 'medtour_group',
        header: 'MedTour Group',
      },
      {
        accessorKey: 'preferred_hand',
        header: 'Preferred Hand',
      },
      {
        accessorKey: 'student_reference',
        header: 'Student Reference',
      },
      {
        accessorKey: 'student_score',
        header: 'Student Score',
        Cell: ({ cell }) => <>{cell.getValue() === null ? '-' : cell.getValue()}</>,
      },
    ],
    []
  );

    const table = useMantineReactTable({
        columns,
        data,
    });

    return <MantineReactTable table={table} />;
}
