import { useState } from 'react';
import { useForm, isNotEmpty } from '@mantine/form';
import { FileWithPath } from '@mantine/dropzone';
import { useSWRConfig } from 'swr';
import { Center } from '@mantine/core';
import TeamForm from './TeamForm';
import { FormValues } from '../../../types/form';
import LoadingPlaceholder from '../../Placeholder/LoadingPlaceholder';

export default function AddTeamForm() {
  const { mutate } = useSWRConfig();
  const form = useForm({
    initialValues: {
      teamName: '',
      prefixTeacher: '',
      firstnameTeacher: '',
      lastnameTeacher: '',
      phoneTeacher: '',
      prefixStudent1: 'นาย',
      firstnameStudent1: '',
      lastnameStudent1: '',
      phoneStudent1: '',
      nationalidStudent1: '',
      emailStudent1: '',
      gradeStudent1: 4,
      preferredHandStudent1: 'right',
      isJoinMedtalkStudent1: false,
      medtourGroupStudent1: '',
      prefixStudent2: 'นาย',
      firstnameStudent2: '',
      lastnameStudent2: '',
      phoneStudent2: '',
      nationalidStudent2: '',
      emailStudent2: '',
      gradeStudent2: 4,
      preferredHandStudent2: 'right',
      isJoinMedtalkStudent2: false,
      medtourGroupStudent2: '',
    },

    validate: {
      teamName: isNotEmpty('กรุณากรอกชื่อทีม'),
      firstnameStudent1: isNotEmpty('กรุณากรอกชื่อ'),
      lastnameStudent1: isNotEmpty('กรุณากรอกนามสกุล'),
      phoneStudent1: (value: string) =>
        /^\d{9,10}$/.test(value) ? null : 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง',
      nationalidStudent1: (value: string) =>
        /^\d{13}$/.test(value) ? null : 'กรุณากรอกเลขประจำตัวประชาชนที่ถูกต้อง',
      emailStudent1: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'อีเมลไม่ถูกต้อง'),
      medtourGroupStudent1: (value, values) =>
        values.isJoinMedtalkStudent1 && !value ? 'กรุณาเลือกกลุ่ม MedTour' : null,
      firstnameStudent2: isNotEmpty('กรุณากรอกชื่อ'),
      lastnameStudent2: isNotEmpty('กรุณากรอกนามสกุล'),
      phoneStudent2: (value: string) =>
        /^\d{9,10}$/.test(value) ? null : 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง',
      nationalidStudent2: (value: string) =>
        /^\d{13}$/.test(value) ? null : 'กรุณากรอกเลขประจำตัวประชาชนที่ถูกต้อง',
      emailStudent2: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'อีเมลไม่ถูกต้อง'),
      medtourGroupStudent2: (value, values) =>
        values.isJoinMedtalkStudent2 && !value ? 'กรุณาเลือกกลุ่ม MedTour' : null,
    },
  });

  const [isSendingData, setIsSendingData] = useState(false);

  const [nationalidImage1, setNationalIdImage1] = useState<FileWithPath | null>(null);
  const [nationalidImage2, setNationalIdImage2] = useState<FileWithPath | null>(null);

  const [studentImage1, setStudentImage1] = useState<FileWithPath | null>(null);
  const [studentImage2, setStudentImage2] = useState<FileWithPath | null>(null);

  const handleSubmit = async (values: FormValues) => {
    if (nationalidImage1 && nationalidImage2 && studentImage1 && studentImage2) {
      const formData = new FormData();
      formData.append('student_1_id', nationalidImage1);
      formData.append('student_2_id', nationalidImage2);
      formData.append('student_1_image', studentImage1);
      formData.append('student_2_image', studentImage2);

      const payload = {
        name: values.teamName,
        teacher_prefix: values.prefixTeacher,
        teacher_firstname: values.firstnameTeacher,
        teacher_lastname: values.lastnameTeacher,
        teacher_phone: values.phoneTeacher,

        student_1_id_number: values.nationalidStudent1,
        student_1_prefix: values.prefixStudent1,
        student_1_firstname: values.firstnameStudent1,
        student_1_lastname: values.lastnameStudent1,
        student_1_email: values.emailStudent1,
        student_1_phone: values.phoneStudent1,
        student_1_grade: Number(values.gradeStudent1),
        student_1_join_medtalk: values.isJoinMedtalkStudent1,
        student_1_preferred_hand: values.preferredHandStudent1,
        student_1_medtour_group: values.medtourGroupStudent1,

        student_2_id_number: values.nationalidStudent2,
        student_2_prefix: values.prefixStudent2,
        student_2_firstname: values.firstnameStudent2,
        student_2_lastname: values.lastnameStudent2,
        student_2_email: values.emailStudent2,
        student_2_phone: values.phoneStudent2,
        student_2_grade: Number(values.gradeStudent2),
        student_2_join_medtalk: values.isJoinMedtalkStudent2,
        student_2_preferred_hand: values.preferredHandStudent2,
        student_2_medtour_group: values.medtourGroupStudent2,
      };
      setIsSendingData(true);
      console.log('payload', payload);

      formData.append('payload', JSON.stringify(payload));

      console.log(formData);

      await fetch('/api/register-team', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setIsSendingData(false);
          console.log(data);
          form.reset();
          setNationalIdImage1(null);
          setNationalIdImage2(null);
          setStudentImage1(null);
          setStudentImage2(null);
          mutate('/api/register-team');
          mutate('/api/status');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('กรุณาเลือกรูปภาพ');
      console.error('No image file selected');
    }
  };
  return (
    <>
      {isSendingData ? (
        <Center sx={{ display: 'flex', flexDirection: 'column' }}>
          <LoadingPlaceholder />
          <span style={{ fontSize: '2rem' }}>กำลังส่งข้อมูล โปรดอย่าปิดหน้านี้</span>
          <span style={{ fontSize: '1rem' }}>หากเกิน 5 นาที ให้ refresh และกรอกข้อมูลใหม่</span>
        </Center>
      ) : (
        <TeamForm
          form={form}
          studentImage1={studentImage1}
          setStudentImage1={setStudentImage1}
          nationalidImage1={nationalidImage1}
          setNationalIdImage1={setNationalIdImage1}
          studentImage2={studentImage2}
          setStudentImage2={setStudentImage2}
          nationalidImage2={nationalidImage2}
          setNationalIdImage2={setNationalIdImage2}
          handleSubmit={handleSubmit}
          submitText="ยืนยัน"
        />
      )}
    </>
  );
}
