import { Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { useState, useEffect } from 'react';
import StudentForm from '../StudentForm/StudentForm';
import TeacherForm from '../TeacherForm/TeacherForm';
import { FormValues } from '../../../types/form';

interface TeamFormProps {
  form: any;
  studentImage1: FileWithPath | null;
  setStudentImage1: (file: FileWithPath | null) => void;
  nationalidImage1: FileWithPath | null;
  setNationalIdImage1: (file: FileWithPath | null) => void;
  studentImage2: FileWithPath | null;
  setStudentImage2: (file: FileWithPath | null) => void;
  nationalidImage2: FileWithPath | null;
  setNationalIdImage2: (file: FileWithPath | null) => void;
  handleSubmit: (a: FormValues) => void;
  submitText: string;
  submitButtonColor?: string;
}

export default function TeamForm({
  form,
  studentImage1,
  setStudentImage1,
  nationalidImage1,
  setNationalIdImage1,
  studentImage2,
  setStudentImage2,
  nationalidImage2,
  setNationalIdImage2,
  handleSubmit,
  submitText,
  submitButtonColor,
}: TeamFormProps) {
  const [warnings, setWarnings] = useState({
    student1: false,
    student2: false,
  });
  const [isMedTalkFull, setIsMedTalkFull] = useState(false);
  const [hasMedTalkSelected, setHasMedTalkSelected] = useState(false);

  const handleWarningChange = (studentId: 'student1' | 'student2', isWarning: boolean) => {
    setWarnings((prev) => ({
      ...prev,
      [studentId]: isWarning,
    }));
  };

  // Check if MedTalk & MedTour is full
  useEffect(() => {
    fetch('/api/check-medtour-capacity?total=true')
      .then((res) => res.json())
      .then((data) => {
        setIsMedTalkFull(data.isFull);
      })
      .catch((error) => {
        console.error('Error checking combined capacity:', error);
      });
  }, []);

  // Watch form values for MedTalk selection
  useEffect(() => {
    const { isJoinMedtalkStudent1, isJoinMedtalkStudent2 } = form.values;
    setHasMedTalkSelected(isJoinMedtalkStudent1 || isJoinMedtalkStudent2);
  }, [form.values.isJoinMedtalkStudent1, form.values.isJoinMedtalkStudent2]);

  const isSubmitDisabled =
    warnings.student1 || warnings.student2 || (isMedTalkFull && hasMedTalkSelected);

  const handleFormSubmit = async (values: FormValues) => {
    // Check combined capacity first - SIMPLE CHECK
    if (values.isJoinMedtalkStudent1 || values.isJoinMedtalkStudent2) {
      const combinedResponse = await fetch('/api/check-medtour-capacity?total=true');
      const combinedData = await combinedResponse.json();

      if (combinedData.isFull) {
        alert(
          'กิจกรรม medtalk & medtour ทั้ง 2 สายเต็มแล้ว กรุณาลบตัวเลือก เข้าร่วม MedTalk & MedTour'
        );
        return;
      }
    }

    // Real-time backend check for group capacity
    const checks = [];
    if (values.isJoinMedtalkStudent1 && values.medtourGroupStudent1) {
      checks.push(
        fetch(
          `/api/check-medtour-capacity?group=${encodeURIComponent(values.medtourGroupStudent1)}`
        )
          .then((res) => res.json())
          .then((data) => ({ student: 1, ...data, group: values.medtourGroupStudent1 }))
      );
    }
    if (values.isJoinMedtalkStudent2 && values.medtourGroupStudent2) {
      checks.push(
        fetch(
          `/api/check-medtour-capacity?group=${encodeURIComponent(values.medtourGroupStudent2)}`
        )
          .then((res) => res.json())
          .then((data) => ({ student: 2, ...data, group: values.medtourGroupStudent2 }))
      );
    }

    const results = await Promise.all(checks);
    const full = results.find((r) => r.total12 >= r.max);
    if (full) {
      alert(
        `ไม่สามารถส่งข้อมูลได้ กลุ่ม MedTour "${full.group}" มีผู้สมัครเต็มแล้ว กรุณาเลือกกลุ่มอื่นหรือยกเลิกการเข้าร่วม MedTalk & MedTour`
      );
      return;
    }
    // If no warnings, proceed with submission
    handleSubmit(values);
  };

  return (
    <>
      <Stack maw={1000} spacing="sm" mx="auto">
        <form onSubmit={form.onSubmit((values: FormValues) => handleFormSubmit(values))}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fz="xl" fw={700}>
              ชื่อทีม
            </Text>
            <TextInput
              label="ชื่อทีม"
              placeholder="ชื่อทีม"
              withAsterisk
              mt="md"
              {...form.getInputProps('teamName')}
            />
          </Card>
          <br />
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fz="xl" fw={700}>
              อาจารย์ที่ปรึกษา (ถ้ามี)
            </Text>
            <TeacherForm
              prefix={form.getInputProps('prefixTeacher')}
              firstname={form.getInputProps('firstnameTeacher')}
              lastname={form.getInputProps('lastnameTeacher')}
              phone={form.getInputProps('phoneTeacher')}
            />
          </Card>
          <br />
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fz="xl" fw={700}>
              นักเรียนคนที่ 1
            </Text>
            <br />
            <StudentForm
              prefix={form.getInputProps('prefixStudent1')}
              firstname={form.getInputProps('firstnameStudent1')}
              lastname={form.getInputProps('lastnameStudent1')}
              phone={form.getInputProps('phoneStudent1')}
              nationalid={form.getInputProps('nationalidStudent1')}
              email={form.getInputProps('emailStudent1')}
              grade={form.getInputProps('gradeStudent1')}
              preferredHand={form.getInputProps('preferredHandStudent1')}
              studentImage={studentImage1}
              setStudentImage={setStudentImage1}
              nationalidImage={nationalidImage1}
              setNationalIdImage={setNationalIdImage1}
              isJoinMedtalk={form.getInputProps('isJoinMedtalkStudent1', { type: 'checkbox' })}
              medtourGroup={form.getInputProps('medtourGroupStudent1')}
              onWarningChange={(isWarning) => handleWarningChange('student1', isWarning)}
            />
          </Card>
          <br />
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fz="xl" fw={700}>
              นักเรียนคนที่ 2
            </Text>
            <br />
            <StudentForm
              prefix={form.getInputProps('prefixStudent2')}
              firstname={form.getInputProps('firstnameStudent2')}
              lastname={form.getInputProps('lastnameStudent2')}
              phone={form.getInputProps('phoneStudent2')}
              nationalid={form.getInputProps('nationalidStudent2')}
              email={form.getInputProps('emailStudent2')}
              grade={form.getInputProps('gradeStudent2')}
              preferredHand={form.getInputProps('preferredHandStudent2')}
              studentImage={studentImage2}
              setStudentImage={setStudentImage2}
              nationalidImage={nationalidImage2}
              setNationalIdImage={setNationalIdImage2}
              isJoinMedtalk={form.getInputProps('isJoinMedtalkStudent2', { type: 'checkbox' })}
              medtourGroup={form.getInputProps('medtourGroupStudent2')}
              onWarningChange={(isWarning) => handleWarningChange('student2', isWarning)}
            />
          </Card>
          <br />
          <Group position="right" mt="md">
            <Button type="submit" color={submitButtonColor} disabled={isSubmitDisabled}>
              {submitText}
            </Button>
          </Group>
        </form>
      </Stack>
    </>
  );
}
