import { Button, Center, Space } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import { mutate } from 'swr';
import { DropPicture } from '../../DropPicture/DropPicture';
import PaymentInfo from '../PaymentInfo';
import LoadingPlaceholder from '../../Placeholder/LoadingPlaceholder';

interface PaymentFormProp {
  teamPrice: number;
  teamRef: string;
  close: () => void;
  notify: () => void;
}

export default function PaymentForm({ teamPrice, teamRef, close, notify }: PaymentFormProp) {
  const [isSendingData, setIsSendingData] = useState(false);
  const [imageFile, setImageFile] = useState<FileWithPath | null>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      setIsSendingData(true);
      const formData = new FormData();
      formData.append('teamRef', teamRef);
      formData.append('image', imageFile);
      const confirmed = window.confirm(
        'กรุณาตรวจสอบความถูกต้อง เนื่องจากหลังจากชำระค่าสมัครแล้วจะไม่สามารถแก้ไขข้อมูลของทีมได้'
      );
      if (confirmed) {
        try {
          const response = await fetch('/api/payment', {
            method: 'PUT',
            body: formData,
          });
          if (!response.ok) {
            throw new Error('Form submission failed');
          }
          setIsSendingData(false);
          notify();
          close();
          mutate('/api/status');
          setImageFile(null);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.error('No image file selected');
      alert('กรุณาเลือกรูปภาพ');
    }
  };
  return (
    <>
      <PaymentInfo purposeText="ร่วมแข่งขัน" teamPrice={teamPrice} />
      {isSendingData ? (
        <Center sx={{ display: 'flex', flexDirection: 'column' }}>
          <LoadingPlaceholder />
          <span style={{ fontSize: '2rem' }}>กำลังส่งข้อมูล โปรดอย่าปิดหน้านี้</span>
          <span style={{ fontSize: '1rem' }}>หากเกิน 5 นาที ให้ refresh และกรอกข้อมูลใหม่</span>
        </Center>
      ) : (
        <Center>
          <form onSubmit={handleSubmit}>
            <div style={{ marginRight: '0.5em', marginLeft: '0.5em' }}>
              <DropPicture
                descriptiontext="อัปโหลดหลักฐานการโอนเงินกรุณาอัปโหลดภาพหลักฐานการโอนเงินที่ชัดและสามารถอ่านได้ เพื่อให้การตรวจสอบเป็นไปอย่างราบรื่น"
                imageFile={imageFile}
                setImageFile={setImageFile}
              />
            </div>
            <Space h="sm" />
            <Center>
              <Button type="submit">ยืนยัน</Button>
            </Center>
          </form>
        </Center>
      )}
    </>
  );
}
