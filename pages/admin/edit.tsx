import { Button, Center, TextInput, Space } from '@mantine/core';
import { useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import AdminEditTeamForm from '../../components/Form/TeamForm/AdminEditTeamForm';

export default function EditData() {
  const [email, setEmail] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const handleFetch = () => {
    setFetchData(true);
  };
  return (
    <AdminLayout>
      <Center>
        <TextInput
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Space h="md" />
        <TextInput
          placeholder="Enter team code"
          value={teamCode}
          onChange={(e) => setTeamCode(e.currentTarget.value)}
        />
        <Space h="md" />
        <Button onClick={handleFetch}>Fetch</Button>
      </Center>
      <Space h="lg" />
      {fetchData && (
        <AdminEditTeamForm email={email.trim()} team_code={teamCode.trim()} />
      )}
    </AdminLayout>
  );
}
