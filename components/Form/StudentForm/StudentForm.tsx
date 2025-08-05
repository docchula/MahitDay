import React, { useEffect, useState } from 'react';
import { Box, Input, TextInput, Text, Space, Checkbox, Button, Modal, Image } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { DropPicture } from '../../DropPicture/DropPicture';
import { useRegisterMedTalkStatus } from '../../../hooks/status';

interface StudentFormProps {
  prefix: { value: string };
  firstname: { value: string };
  lastname: { value: string };
  phone: { value: string };
  nationalid: { value: string };
  email: { value: string };
  grade: { value: string };
  preferredHand: { value: string };
  studentImage: FileWithPath | null;
  setStudentImage: (file: FileWithPath | null) => void;
  nationalidImage: FileWithPath | null;
  setNationalIdImage: (file: FileWithPath | null) => void;
  isJoinMedtalk: { checked: boolean };
  medtourGroup?: { value: string; onChange: (e: any) => void };
  onWarningChange?: (hasWarning: boolean) => void;
}
export default function StudentForm({
  prefix,
  firstname,
  lastname,
  phone,
  nationalid,
  email,
  grade,
  preferredHand,
  studentImage,
  setStudentImage,
  nationalidImage,
  setNationalIdImage,
  isJoinMedtalk,
  medtourGroup,
  onWarningChange,
}: StudentFormProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { isMedTalkFull } = useRegisterMedTalkStatus();
  // const [capacityInfo, setCapacityInfo] = useState<{ total12: number; total2: number; max: number } | null>(null);
  const [showWarning, setShowWarning] = useState('');
  const [isCombinedFull, setIsCombinedFull] = useState(false);

  useEffect(() => {
    // Check combined capacity first
    fetch('/api/check-medtour-capacity?total=true')
      .then((res) => res.json())
      .then((data) => {
        setIsCombinedFull(data.isFull);
      })
      .catch((error) => {
        console.error('Error checking combined capacity:', error);
      });
  }, []);

  useEffect(() => {
    if (medtourGroup && medtourGroup.value && isJoinMedtalk.checked) {
      fetch(`/api/check-medtour-capacity?group=${encodeURIComponent(medtourGroup.value)}`)
        .then((res) => res.json())
        .then((data) => {
          // setCapacityInfo(data);
          if (data.total12 >= data.max) {
            setShowWarning(
              '⚠️ จำนวนผู้สมัครที่เลือก Medtour group นี้มีจำนวนมาก ท่านอาจจะถูกย้าย group หรือ สละสิทธิ์ ตามตัวเลือกต่อไป'
            );
          } else {
            setShowWarning('');
          }
        });
    } else {
      setShowWarning('');
      // setCapacityInfo(null);
    }
  }, [medtourGroup && medtourGroup.value, isJoinMedtalk.checked]);

  useEffect(() => {
    if (onWarningChange) {
      onWarningChange(showWarning !== '');
    }
  }, [showWarning, onWarningChange]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="วิธีเซ็นสำเนาบัตรประจำตัวประชาชน" centered>
        <Image
          radius="md"
          src="/signed-example.webp"
          alt="Signed Example"
          sx={{ width: '100%', height: 'auto' }}
        />
      </Modal>
      <Box>
        <Text>คำนำหน้าชื่อ</Text>
        <Input
          component="select"
          rightSection={<IconChevronDown size={14} stroke={1.5} />}
          {...prefix}
        >
          <option value="นาย">นาย</option>
          <option value="นาง">นาง</option>
          <option value="นางสาว">นางสาว</option>
        </Input>
        <TextInput label="ชื่อ" placeholder="ชื่อ" withAsterisk mt="md" {...firstname} />
        <TextInput label="นามสกุล" placeholder="นามสกุล" withAsterisk mt="md" {...lastname} />
        <TextInput label="โทรศัพท์" placeholder="0812345678" withAsterisk mt="md" {...phone} />
        <TextInput
          label="เลขประจำตัวประชาชน"
          placeholder="xxxxxxxxxxx"
          withAsterisk
          mt="md"
          {...nationalid}
        />
        <TextInput mt="sm" label="อีเมล" placeholder="อีเมล" withAsterisk {...email} />
        <Space h="sm" />
        <Text>ระดับชั้น</Text>
        <Input
          component="select"
          rightSection={<IconChevronDown size={14} stroke={1.5} />}
          {...grade}
        >
          <option value={4}>ม.4</option>
          <option value={5}>ม.5</option>
          <option value={6}>ม.6</option>
        </Input>
        <Space h="sm" />
        <Text>มือข้างที่ถนัด</Text>
        <Input
          component="select"
          rightSection={<IconChevronDown size={14} stroke={1.5} />}
          {...preferredHand}
        >
          <option value="right">ขวา</option>
          <option value="left">ซ้าย</option>
        </Input>
        <Space h="sm" />
        <Text>ภาพถ่ายนักเรียน</Text>
        <DropPicture
          descriptiontext="ขอให้ใช้ภาพถ่ายนักเรียนไม่มีขอบขาว ไม่ต้องลงชื่อทับ และหันด้านให้ถูกต้อง โดยมีขนาดไฟล์ไม่เกิน 2 MB เพื่อคณะกรรมการจะได้นำไปออกบัตรประจำตัวผู้สอบได้สะดวก"
          imageFile={studentImage}
          setImageFile={setStudentImage}
        />
        <Space h="sm" />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Text>สำเนาบัตรประจำตัวประชาชน</Text>
          <Button variant="subtle" compact onClick={open} sx={{ margin: '0.1em' }}>
            วิธีเซ็น
          </Button>
        </Box>
        <DropPicture
          descriptiontext='ขอให้ใช้สำเนาบัตรประขาชนที่ถ่ายหนัาบัตรด้านเดียว เซ็นรับรองสำเนาถูกต้อง วันที่ที่ทำการสมัคร พร้อมระบุว่า "ใช้เพื่อสมัครเข้าร่วมโครงการตอบปัญหาวิชาการและวิทยาศาสตร์การแพทย์ เนื่องในวันอานันทมหิดล (AMSCI) ประจำปีการศึกษา 2568 เท่านั้น" โดยมีขนาดไฟล์ไม่เกิน 2 MB'
          imageFile={nationalidImage}
          setImageFile={setNationalIdImage}
        />
        <Checkbox
          label="เข้าร่วม MedTalk & MedTour"
          mt="sm"
          size="md"
          {...isJoinMedtalk}
          // disabled={isMedTalkFull}
          style={{ visibility: 'hidden' }}
        />
        {isJoinMedtalk.checked && (
          <>
            <Input component="select" mt="sm" {...medtourGroup}>
              <option value="" disabled>
                เลือกกลุ่ม
              </option>
              <option value="Gross anatomy">Gross anatomy</option>
              <option value="Histology">Histology</option>
            </Input>
            {/* Warning message */}
            {showWarning && (
              <Text color="orange" mt="xs">
                {showWarning}
              </Text>
            )}
            {/* medtour_flex checkbox */}
            <Text size="sm" color="dimmed" mt="sm">
              สายที่เลือกเป็นเเค่การแสดงความจำนง ท่านอาจถูกย้ายสายหากมีความจำเป็น
            </Text>
          </>
        )}
        {isMedTalkFull && <Text c="orange">MedTalk & MedTour เต็มแล้ว</Text>}
        {isCombinedFull && (
          <Text c="red" mt="xs">
            กิจกรรม medtalk medtour เต็มรับเต็มจำนวนแล้ว
          </Text>
        )}
      </Box>
    </>
  );
}
