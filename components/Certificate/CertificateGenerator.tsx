/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { Button, Stack, Text } from '@mantine/core';
import certificateTemplate from '../../public/certificate.webp';
import { family, src } from '../../font/CHULALONGKORN-Bold';

interface Student {
  prefix: string;
  firstname: string;
  lastname: string;
  student_score: number | null;
  national_id: string;
}

interface CertificateGeneratorProps {
  student1: Student;
  student2: Student;
}

export default function CertificateGenerator({ student1, student2 }: CertificateGeneratorProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleDownload = async (student: Student) => {
    setButtonDisabled(true); // Disable the button

    const studentName = `${student.prefix}${student.firstname} ${student.lastname}`;
    if (canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Draw the image
      const img = imgRef.current;
      const myFont = new FontFace(
        family,
        `url(data:font/truetype;charset=utf-8;base64,${src}) format('truetype')`
      );

      if (context !== null) {
        myFont
          .load()
          .then((loadedFont) => {
            // Add the font to the document
            document.fonts.add(loadedFont);

            // Now the font is available to use
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Set the font for the context
            context.fillStyle = 'black';
            context.font = '120px CHULALONGKORN';
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2 - 80;

            // Draw the text with the font
            context.fillText(studentName, centerX, centerY);

            // Trigger download
            const link = document.createElement('a');
            link.style.cursor = 'pointer';
            link.href = canvas.toDataURL();
            link.download = `${student.prefix}${student.firstname}_${student.lastname}_certificate.png`;
            link.click();
          })
          .catch((error) => {
            console.error(`Failed to load the font: ${error}`);
          })
          .finally(() => {
            setButtonDisabled(false);
          });
      }
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={2794} height={1978} style={{ display: 'none' }} />
      <img
        ref={imgRef}
        src={certificateTemplate.src}
        alt="Certificate Template"
        style={{ display: 'none' }}
      />
      {student1 && student2 && (
        <>
          <Stack>
            <Text fw={700}>ดาวน์โหลดเกียรติบัตร</Text>
            <Text c="dimmed">กรุณาใช้ Safari หากใช้ iPhone หรือ iPad</Text>
            {student1.student_score !== null && (
              <Button
                type="button"
                onClick={() => handleDownload(student1)}
                disabled={buttonDisabled}
              >
                {student1.firstname} {student1.lastname}
              </Button>
            )}
            {student2.student_score !== null && (
              <Button
                type="button"
                onClick={() => handleDownload(student2)}
                disabled={buttonDisabled}
              >
                {student2.firstname} {student2.lastname}
              </Button>
            )}
          </Stack>
        </>
      )}
    </div>
  );
}
