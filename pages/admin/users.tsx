import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/Layout/AdminLayout';
import UserTable from '../../components/Table/UserTable';

export default function Users() {
    const { data: session } = useSession();
    if (session?.user?.email) {
        if (session.user.email.split('@')[1] !== 'docchula.com') return <pre>Unauthorized</pre>;
        return (
            <>
                <AdminLayout>
                    <UserTable />
                </AdminLayout>
            </>
        );
    }
    return <pre>Unauthorized</pre>;
}
