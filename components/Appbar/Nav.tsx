import { Box, Divider, NavLink } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { IconAlertSquare } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { IconInfoSquare, IconSquare, IconSquareCheck, IconUser } from '@tabler/icons-react';
import { useRegisterStatus, useStatus } from '../../hooks/status';
import { REGISTRATION_STAGE } from '../../utils/config';

export default function Nav() {
  const { data: session } = useSession();
  const { isAgree, isSchoolDone, isStudentDone, isPaymentDone } = useStatus();
  const { isAvailable } = useRegisterStatus();

  let navList: any[];
  // @ts-ignore
  if (isAvailable === true && REGISTRATION_STAGE === 'register') {
    navList = [
      { id: 'information', label: 'ขั้นตอนการสมัคร', done: true, link: 'info' },
      { id: 'agreement', label: 'รับทราบกติกาการแข่งขัน', done: isAgree, link: 'step1' },
      { id: 'school', label: 'กรอกข้อมูลโรงเรียน', done: isSchoolDone, link: 'step2' },
      { id: 'student', label: 'กรอกข้อมูลผู้สมัคร', done: isStudentDone, link: 'step3' },
      { id: 'payment', label: 'ยืนยันการสมัคร', done: isPaymentDone, link: 'step4' },
      // { id: 'scorereport', label: 'พิมพ์เกียรติบัตร', done: isPaymentDone, link: 'step5' },
      // { id: 'medtalk', label: 'เพิ่มผู้เข้าร่วมงาน MedTalk', done: false, link: 'medtalk' },
    ];
  } else {
    navList = [
      { id: 'checkstatus', label: 'ตรวจสอบสถานะ', done: isPaymentDone, link: 'step4' },
      { id: 'scorereport', label: 'พิมพ์เกียรติบัตร', done: true, link: 'step5' },
      // { id: 'medtalk', label: 'เพิ่มผู้เข้าร่วมงาน MedTalk', done: false, link: 'medtalk' },
    ];
  }
  const router = useRouter();
  const currentIndex = navList.findIndex((item) => `/dashboard/${item.link}` === router.pathname);
  const [active, setActive] = useState(currentIndex);
  useEffect(() => {
    setActive(currentIndex >= 0 ? currentIndex : 0);
  }, [router.pathname]);
  const items = navList.map((item, index) => (
    <div key={item.id}>
      <NavLink
        active={index === active}
        label={
          <Box sx={{ display: 'flex', justifyContent: 'left' }}>
            {(() => {
              switch (true) {
                case item.done === true:
                  return (
                    <IconSquareCheck
                      color="green"
                      style={{ marginRight: '0.5em', minWidth: '1.8em' }}
                    />
                  );
                case item.label === 'ข้อมูลผู้สมัคร':
                  return (
                    <IconInfoSquare
                      color="#74c0fc"
                      style={{ marginRight: '0.5em', minWidth: '1.8em' }}
                    />
                  );
                // case item.link === 'medtalk':
                //   return (
                //     <IconAlertSquare
                //       color="orange"
                //       style={{ marginRight: '0.5em', minWidth: '1.8em' }}
                //     />
                //   );
                default:
                  return (
                    <IconSquare color="red" style={{ marginRight: '0.5em', minWidth: '1.8em' }} />
                  );
              }
            })()}
            {item.label}
          </Box>
        }
        onClick={() => {
          setActive(index);
          router.push(`/dashboard/${item.link}`);
        }}
        disabled={(() => {
          switch (item.link) {
            case 'step2':
              return !isAgree;
            case 'step3':
              return !isAgree || !isSchoolDone;
            case 'step4':
              return !isAgree || !isStudentDone;
            case 'step5':
              return !isAgree || !isPaymentDone;
            // return true;
            default:
              return false;
          }
        })()}
        styles={{
          root: {
            '&[data-active]': {
              backgroundColor: '#26262e',
              color: '#716FD0',
              '&:hover': {
                backgroundColor: '#26262e',
              },
            },
          },
        }}
      />
      {/* {index === navList.length - 6 && <Divider m="sm" />}
      {index === navList.length - 2 && <Divider m="sm" />} */}
    </div>
  ));
  return (
    <>
      <Box w={{ sm: 164, lg: 264 }}>
        {items}
        <Divider m="sm" />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconUser style={{ marginLeft: '0.5em', marginRight: '0.5em' }} />
          <span>{session?.user?.name}</span>
        </Box>
      </Box>
    </>
  );
}
