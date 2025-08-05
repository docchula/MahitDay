import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface AlertBadeProps {
  title: string;
  color: string;
  description: string;
}
export default function AlertBadge(props: AlertBadeProps) {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title={props.title} color={props.color} m="sm">
      {props.description}
    </Alert>
  );
}
