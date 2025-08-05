import jsPDF from 'jspdf';
import '../../font/Sarabun-Regular-normal';
import '../../font/Sarabun-Light-normal';
import '../../font/THSarabunChula-Regular-normal';
import { Button } from '@mantine/core';
import QRCode from 'qrcode';
import { transFormRoomNumber } from '../../utils/function';

interface TicketGeneratorProps {
  team_reference: string; // Or whatever type it's supposed to be
  toggleLoader: (a: boolean) => void;
}
interface ImageDetail {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function TicketGenerator({ team_reference, toggleLoader }: TicketGeneratorProps) {
  // eslint-disable-next-line consistent-return
  const generate = async () => {
    toggleLoader(true);

    const getImageDimensions = (base64String: string): Promise<{ width: number; height: number }> =>
      new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };

        img.onerror = (err) => {
          reject(err);
        };

        img.src = `data:image/jpeg;base64,${base64String}`;
      });

    const response = await fetch('/api/admission-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ team_reference }),
    });

    if (response.status === 400) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();
      doc.setFont('THSarabunChula-Bold');
      doc.setFontSize(26);
      doc.text('ไม่สามารถดาวน์โหลดใบสมัครได้ โปรดติดต่อกรรมการ', 20, 20);
      doc.save('error-ticket.pdf');
      toggleLoader(false);
      return <></>;
    }

    const generateQR = async (data: any) => {
      const url = await QRCode.toDataURL(data);
      return url;
    };

    const data = await response.json();

    const shorten_team_name =
      data.team[0].name.length < 20 ? data.team[0].name : `${data.team[0].name.slice(0, 28)}...`;
    const shorten_school = data.school.length < 20 ? data.school : `${data.school.slice(0, 30)}...`;

    const student_1_id = `ID: ${data.transformedStudents[0].student_id}`;
    const student_1_location = transFormRoomNumber(data.transformedStudents[0].student_id);
    const student_1_medtalk = data.transformedStudents[0].is_join_medtalk
  ? `MedTalk & MedTour: ${data.transformedStudents[0].medtour_group || ''}`
  : '';
    const student_1_name = `${String(data.transformedStudents[0].firstname)}  ${String(
      data.transformedStudents[0].lastname
    )}`;
    const student_1_school = `โรงเรียน ${String(shorten_school)}`;
    const student_1_qr = await generateQR(data.transformedStudents[0].student_id);

    const student_2_id = `ID: ${data.transformedStudents[1].student_id}`;
    const student_2_location = transFormRoomNumber(data.transformedStudents[1].student_id);
   const student_2_medtalk = data.transformedStudents[1].is_join_medtalk
  ? `MedTalk & MedTour: ${data.transformedStudents[1].medtour_group || ''}` // Add medtour_group here
  : '';
    const student_2_name = `${String(data.transformedStudents[1].firstname)}  ${String(
      data.transformedStudents[1].lastname
    )}`;
    const student_2_school = `โรงเรียน ${String(shorten_school)}`;
    const team = `ทีม ${String(shorten_team_name)}  #${String(data.team[0].team_code)}`;
    const student_2_qr = await generateQR(data.transformedStudents[1].student_id);

    const imageDetails: { [key: string]: ImageDetail } = {
      image_1: { width: 0, height: 0, x: 0, y: 0 },
      image_2: { width: 0, height: 0, x: 0, y: 0 },
    };

    const calculateDimensions = async (imgData: string, key: string) => {
      try {
        const dimensions = await getImageDimensions(imgData);
        if (dimensions.width / dimensions.height >= 0.8) {
          imageDetails[key].width = 40;
          imageDetails[key].height = Math.floor(40 * (dimensions.height / dimensions.width));
          imageDetails[key].y = (50 - imageDetails[key].height) / 2;
        } else {
          imageDetails[key].height = 50;
          imageDetails[key].width = Math.floor(50 * (dimensions.width / dimensions.height));
          imageDetails[key].x = (40 - imageDetails[key].width) / 2;
        }
      } catch (error) {
        console.error('Error fetching dimensions:', error);
      }
    };

    await Promise.all([
      calculateDimensions(data.image_1, 'image_1'),
      calculateDimensions(data.image_2, 'image_2'),
    ]);

    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    doc.setFont('THSarabunChula-Regular');

    doc.setFontSize(26);
    doc.text('บัตรเข้าร่วมแข่งขัน AMSCI - 2025', 20, 20);

    doc.setFontSize(20);
    doc.text('ตัดบัตรนี้เป็นสามส่วนและแสดงให้กรรมการคุมสอบหน้าห้องสอบ', 20, 30);

    doc.setDrawColor(0, 0, 160);
    doc.setLineWidth(1.5);
    doc.line(20, 35, 150, 35);

    doc.setLineWidth(0.5);
    doc.setFontSize(18);
    doc.text('บัตรประจำตัวผู้เข้าสอบคนที่ 1', 20, 55);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 60, 160, 60, 3, 3, 'FD');
    doc.setFontSize(24);
    doc.text(student_1_id, 30, 70);
    doc.setFontSize(18);
    //doc.rect(120, 65, 40, 50);
    //doc.rect(150, 100, 15, 15, 'F');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 160);
    doc.text('AMSCI 2025', 168, 70, undefined, -90);

    //doc.text("AMSCI 2024", 170, 75, null, -90);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text(student_1_name, 35, 80);
    doc.text(student_1_location, 35, 89);
    doc.text(student_1_school, 35, 98);
    doc.text(team, 35, 107);
    doc.text(student_1_medtalk, 35, 116);

    //doc.text(String(base64[0].stringify), 30, 50)
    //doc.addImage(base64, 'JPEG', 70, 30, 180, 180)

    doc.setFontSize(18);
    doc.text('บัตรประจำตัวผู้เข้าสอบคนที่ 2', 20, 135);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 140, 160, 60, 3, 3, 'FD');
    doc.setFontSize(24);
    doc.text(student_2_id, 30, 150);
    doc.setFontSize(18);
    doc.rect(120, 145, 40, 50);
    //doc.rect(150, 180, 15, 15, 'F');
    doc.setFontSize(20);

    doc.setTextColor(0, 0, 160);
    doc.text('AMSCI 2025', 168, 150, undefined, -90);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text(student_2_name, 35, 160);
    doc.text(student_2_location, 35, 169);
    doc.text(student_2_school, 35, 178);
    doc.text(team, 35, 187);
    doc.text(student_2_medtalk, 35, 196);

    if (data.image_1) {
      const base64Image = `data:image/jpeg;base64,${data.image_1}`;
      doc.addImage(
        base64Image,
        'JPEG',
        120 + imageDetails.image_1.x,
        65 + imageDetails.image_1.y,
        imageDetails.image_1.width,
        imageDetails.image_1.height
      );
      doc.addImage(String(student_1_qr), 'JPEG', 161, 100, 25, 25);
    }
    if (data.image_2) {
      const base64Image = `data:image/jpeg;base64,${data.image_2}`;
      doc.addImage(
        base64Image,
        'JPEG',
        120 + imageDetails.image_2.x,
        145 + imageDetails.image_2.y,
        imageDetails.image_2.width,
        imageDetails.image_2.height
      );
      doc.addImage(String(student_2_qr), 'JPEG', 161, 180, 25, 25);
    }

    doc.rect(120, 65, 40, 50);
    doc.rect(120, 145, 40, 50);
    doc.text(new Date().toLocaleString(), 20, 210);
    doc.save('amsci2025-ticket.pdf');
    toggleLoader(false);
  };

  return (
    <div>
      <Button type="button" color="green" onClick={generate}>
        พิมพ์บัตรเข้าสอบ
      </Button>
    </div>
  );
}
