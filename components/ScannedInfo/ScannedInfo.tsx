import React, { useEffect, useState } from 'react';
import { Card, Button, List, Divider } from '@mantine/core';
import { toast } from 'react-toastify';
import { transFormRoomNumber } from '../../utils/function';

interface ScannedInfoProps {
  id: string;
}

interface Data {
  firstname: string;
  lastname: string;
  student_id: number;
  grade: number;
  school: string;
  province: string;
  team_name: string;
  team_code: number;
}

export default function ScannedInfo(props: ScannedInfoProps) {
  const [data, setData] = useState<Data>();

  useEffect(() => {
    if (props.id !== '') {
      fetch(`/api/admin/register?id=${props.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [props.id]);

  const handleRegister = (id: string) => {
    // update score from null to 0
    fetch('/api/admin/register', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: id,
      }),
    })
      .then(async response => {
        const resData = await response.json();
        if (response.ok) {
          toast.success('Status Updated', {
            position: 'bottom-right',
            theme: 'colored',
          });
        } else {
          toast.error(resData.message, {
            position: 'bottom-right',
            theme: 'colored',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (data) {
    return (
      <>
      <Card key={data.student_id} shadow="sm" padding="lg" radius="md" withBorder>
        <List type="ordered">
          <List.Item>ID: {data.student_id}</List.Item>
          <List.Item>
            ชื่อ {data.firstname} {data.lastname}
          </List.Item>
          <List.Item>{transFormRoomNumber(data.student_id)}</List.Item>
          <List.Item>
            โรงเรียน {data.school} | จังหวัด {data.province}
          </List.Item>
          <List.Item>
            ทีม {data.team_name} | รหัส {data.team_code}
          </List.Item>
        </List>
        <Divider size="sm" mt={10} mb={10} />
        <Button color="green" fullWidth mt="md" radius="md" onClick={() => handleRegister(props.id)}>
          ลงทะเบียน
        </Button>
      </Card>
      </>
    );
  }
  return null;
}
