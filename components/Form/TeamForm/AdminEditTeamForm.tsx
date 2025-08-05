import { useEffect, useState } from 'react';
import { useForm, isNotEmpty } from '@mantine/form';
import { FileWithPath } from '@mantine/dropzone';
import { useSWRConfig } from 'swr';
import { Center } from '@mantine/core';
import TeamForm from './TeamForm';
import { FormValues } from '../../../types/form';
import LoadingPlaceholder from '../../Placeholder/LoadingPlaceholder';

interface AdminEditTeamFormProps {
  email: string;
  team_code: string;
}
export default function AdminEditTeamForm({ email, team_code }: AdminEditTeamFormProps) {
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
  const [studentReference1, setStudentReference1] = useState('');
  const [studentReference2, setStudentReference2] = useState('');
  const [teamReference, setTeamReference] = useState('');
  const [noTeamError, setNoTeamError] = useState('');
  const selectedTeam = 0;

  useEffect(() => {
    if (!form.values.isJoinMedtalkStudent1) {
      form.setFieldValue('medtourGroupStudent1', '');
    }
  }, [form.values.isJoinMedtalkStudent1, form.setFieldValue]);

  useEffect(() => {
    if (!form.values.isJoinMedtalkStudent2) {
      form.setFieldValue('medtourGroupStudent2', '');
    }
  }, [form.values.isJoinMedtalkStudent2, form.setFieldValue]);

  useEffect(() => {
    fetch('/api/admin/edit-student', {
      method: 'POST',
      body: JSON.stringify({ email, team_code }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'no team registered found') {
          setNoTeamError('no-team-found');
        }
        if (data[selectedTeam] && data[selectedTeam].student_1) {
          setTeamReference(data[selectedTeam].team_reference);
          setStudentReference1(data[selectedTeam].student_1.student_reference);
          setStudentReference2(data[selectedTeam].student_2.student_reference);
          form.setValues({
            teamName: data[selectedTeam].name,
            prefixTeacher: data[selectedTeam].teacher_prefix,
            firstnameTeacher: data[selectedTeam].teacher_firstname,
            lastnameTeacher: data[selectedTeam].teacher_lastname,
            phoneTeacher: data[selectedTeam].teacher_phone,
            prefixStudent1: data[selectedTeam].student_1.prefix,
            firstnameStudent1: data[selectedTeam].student_1.firstname,
            lastnameStudent1: data[selectedTeam].student_1.lastname,
            phoneStudent1: data[selectedTeam].student_1.phone_number,
            nationalidStudent1: data[selectedTeam].student_1.national_id,
            emailStudent1: data[selectedTeam].student_1.email,
            gradeStudent1: data[selectedTeam].student_1.grade,
            preferredHandStudent1: data[selectedTeam].student_1.preferred_hand,
            isJoinMedtalkStudent1: data[selectedTeam].student_1.is_join_medtalk,
            medtourGroupStudent1: data[selectedTeam].student_1.medtour_group,
            prefixStudent2: data[selectedTeam].student_2.prefix,
            firstnameStudent2: data[selectedTeam].student_2.firstname,
            lastnameStudent2: data[selectedTeam].student_2.lastname,
            phoneStudent2: data[selectedTeam].student_2.phone_number,
            nationalidStudent2: data[selectedTeam].student_2.national_id,
            emailStudent2: data[selectedTeam].student_2.email,
            gradeStudent2: data[selectedTeam].student_2.grade,
            preferredHandStudent2: data[selectedTeam].student_2.preferred_hand,
            isJoinMedtalkStudent2: data[selectedTeam].student_2.is_join_medtalk,
            medtourGroupStudent2: data[selectedTeam].student_2.medtour_group,
          });
          fetch('/api/admin/edit-student/studentimage', {
            method: 'POST',
            body: JSON.stringify({ student_ref: data[selectedTeam].student_1.student_reference }),
          })
            .then((response) => response.json())
            .then((info) => {
              // Set image data in state
              setStudentImage1(info.image);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          fetch('/api/admin/edit-student/studentid', {
            method: 'POST',
            body: JSON.stringify({ student_ref: data[selectedTeam].student_1.student_reference }),
          })
            .then((response) => response.json())
            .then((info) => {
              setNationalIdImage1(info.image);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          fetch('/api/admin/edit-student/studentimage', {
            method: 'POST',
            body: JSON.stringify({ student_ref: data[selectedTeam].student_2.student_reference }),
          })
            .then((response) => response.json())
            .then((info) => {
              setStudentImage2(info.image);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          fetch('/api/admin/edit-student/studentid', {
            method: 'POST',
            body: JSON.stringify({ student_ref: data[selectedTeam].student_2.student_reference }),
          })
            .then((response) => response.json())
            .then((info) => {
              setNationalIdImage2(info.image);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      })
      .catch((error) => console.error('Error:', error));
  }, [selectedTeam]);
  const handleSubmit = async (values: FormValues) => {
    setIsSendingData(true);
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
        student_1_medtour_group: values.medtourGroupStudent1,
        student_1_preferred_hand: values.preferredHandStudent1,
        student_1_reference: studentReference1,
        student_2_id_number: values.nationalidStudent2,
        student_2_prefix: values.prefixStudent2,
        student_2_firstname: values.firstnameStudent2,
        student_2_lastname: values.lastnameStudent2,
        student_2_email: values.emailStudent2,
        student_2_phone: values.phoneStudent2,
        student_2_grade: Number(values.gradeStudent2),
        student_2_join_medtalk: values.isJoinMedtalkStudent2,
        student_2_medtour_group: values.medtourGroupStudent2,
        student_2_preferred_hand: values.preferredHandStudent2,
        student_2_reference: studentReference2,
        team_reference: teamReference,
      };
      console.log('payload', payload);
      formData.append('payload', JSON.stringify(payload));
      console.log(formData);
      await fetch('/api/admin/edit-student', {
        method: 'PUT',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setIsSendingData(false);
          alert('แก้ไขข้อมูลสำเร็จ');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('No image file selected');
    }
    mutate('/api/admin/edit-student');
  };
  if (noTeamError === 'no-team-found') {
    return <Center>ไม่พบทีมที่ต้องการแก้ไข</Center>;
  }
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
          submitText="แก้ไข"
          submitButtonColor="orange"
        />
      )}
    </>
  );
}
