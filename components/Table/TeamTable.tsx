import { useEffect, useMemo, useState } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';

interface TeamData {
    id: number;
    name: string;
    email: string;
    team_code: number;
    teacher_prefix: string;
    teacher_firstname: string;
    teacher_lastname: string;
    teacher_phone: string;
    all_join_medtalk: number;
    total_payment: number;
    enrollment_status: number;
    team_reference: string;
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
                setData(response.data);
            });
    }, []);

    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<TeamData>[]>(
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
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'team_code',
                header: 'Team Code',
            },
            {
                accessorKey: 'teacher_prefix',
                header: 'Teacher Prefix',
            },
            {
                accessorKey: 'teacher_firstname',
                header: 'Teacher Firstname',
            },
            {
                accessorKey: 'teacher_lastname',
                header: 'Teacher Lastname',
            },
            {
                accessorKey: 'teacher_phone',
                header: 'Teacher Phone',
            },
            {
                accessorKey: 'all_join_medtalk',
                header: 'MedTalk & MedTour',
            },
            {
                accessorKey: 'total_payment',
                header: 'Total Payment',
            },
            {
                accessorKey: 'enrollment_status',
                header: 'Enrollment Status',
            },
            {
                accessorKey: 'team_reference',
                header: 'Team Reference',
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
