import { Badge } from '@mantine/core';

interface StatusProp {
  statusNumber: number;
  reservedOrder?: number;
}

export default function StatusConverter({ statusNumber, reservedOrder }: StatusProp) {
  let text = '';
  let color = '';

  if (reservedOrder) {
    switch (statusNumber) {
      case 1:
        text = `สำรองอันดับที่ ${reservedOrder} กำลังตรวจสอบเอกสาร`;
        color = 'orange';
        break;
      case 2:
        text = `สำรองอันดับที่ ${reservedOrder} สมัครสำเร็จ`;
        color = 'blue';
        break;
      case 3:
        text = `สำรองอันดับที่ ${reservedOrder} กรุณาติดต่อกรรมการ`;
        color = 'red';
        break;
      case 4:
        text = `สำรองอันดับที่ ${reservedOrder} พิมพ์บัตรสอบได้ที่หน้ายืนยันการสมัคร`;
        color = 'green';
        break;
      default:
        text = `สำรองอันดับที่ ${reservedOrder}`;
        color = 'gray';
        break;
    }
  } else {
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
        text = 'พิมพ์บัตรสอบได้ที่หน้ายืนยันการสมัคร';
        color = 'green';
        break;
      default:
        text = 'ไม่ทราบสถานะ';
        color = 'gray';
        break;
    }
  }
  return (
    <Badge color={color} size="xl" variant="dot">
      {text}
    </Badge>
  );
}
