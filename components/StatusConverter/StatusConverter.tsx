import { Badge } from '@mantine/core';

interface StatusProp {
  statusNumber: number;
}

export default function StatusConverter({ statusNumber }: StatusProp) {
  let text = '';
  let color = '';

  switch (statusNumber) {
    case 0:
      text = 'ยังไม่ได้เข้าร่วม';
      color = 'dark';
      break;
    case 1:
      text = 'กำลังตรวจสอบเอกสาร';
      color = 'orange';
      break;
    case 2:
      text = 'สมัครสำเร็จ';
      color = 'blue';
      break;
    case 3:
      text = 'กรุณาติดต่อกรรมการ';
      color = 'red';
      break;
    case 4:
      text = 'พิมพ์บัตรสอบได้ที่หน้าชำระค่าสมัคร';
      color = 'green';
      break;
    default:
      text = 'ไม่ทราบสถานะ';
      break;
  }
  return (
    <>
      <Badge color={color} size="xl" variant="dot">
        {text}
      </Badge>
    </>
  );
}
