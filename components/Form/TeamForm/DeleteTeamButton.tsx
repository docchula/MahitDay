import { Button } from '@mantine/core';
import { useSWRConfig } from 'swr';

interface DeleteTeamFormProps {
  teamReference: string;
}

export default function DeleteTeamButton({ teamReference }: DeleteTeamFormProps) {
  const { mutate } = useSWRConfig();

  const handleSubmit = async () => {
    const confirmed = window.confirm('กรุณายืนยันการลบข้อมูล');
    if (confirmed) {
      try {
        const response = await fetch(`/api/register-team/?teamRef=${teamReference}&method=delete`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          mutate('/api/register-team');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Button color="red" onClick={handleSubmit}>
      ลบ
    </Button>
  );
}
