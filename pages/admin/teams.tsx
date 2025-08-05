import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/Layout/AdminLayout';
import TeamTable from '../../components/Table/TeamTable';

export default function Teams() {
    const { data: session } = useSession();
    if (session?.user?.email) {
        if (session.user.email.split('@')[1] !== 'docchula.com') return <pre>Unauthorized</pre>;
        return (
            <>
                <AdminLayout>
                    <TeamTable />
                </AdminLayout>
            </>
        );
    }
    return <pre>Unauthorized</pre>;
}
