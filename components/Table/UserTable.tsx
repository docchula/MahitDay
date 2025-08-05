import { useEffect, useMemo, useState } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';

interface UserData {
    id: number;
    name: string;
    lastname: string;
    email: string;
    school: string;
    school_location: string;
    school_phone_number: string;
    province: string;
    agree_to_terms: boolean;
  }

export default function UserTable() {
    const [data, setData] = useState<UserData[]>([]);
    useEffect(() => {
        fetch('/api/admin/users')
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Network response was not ok ${response.statusText}`);
            }
            return response.json();
          })
          .then((response) => {
            setData(response.data);
          });
      }, []);
    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<UserData>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'school',
                header: 'School',
            },
            {
                accessorKey: 'school_location',
                header: 'School Location',
            },
            {
                accessorKey: 'school_phone_number',
                header: 'School Phone',
            },
            {
                accessorKey: 'province',
                header: 'Province',
            },
            {
                accessorKey: 'agree_to_terms',
                header: 'Agree to Terms',
                Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data,
    });

    return <MantineReactTable table={table} />;
}
