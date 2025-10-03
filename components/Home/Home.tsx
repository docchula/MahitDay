// @ts-nocheck

import {
  Button,
  Divider,
  Flex,
  Group,
  Title,
  MediaQuery,
  Box,
  Text,
  Indicator,
} from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import FAQ from './FAQ/FAQ';
import MaxMinScore from './MaxMinScore/MaxMinScore';
import SocialIcons from './SocialIcons/SocialIcons';
import { REGISTRATION_STAGE } from '../../utils/config';
import mahitdayLogo from '../../public/mahitday-logo.png';

export default function Home() {
  return (
    <main>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '2em' }}>
        <Title order={1}>
          <span style={{ color: '#485FB2' }}>Mahitday</span>{' '}
          <span style={{ color: '#FBB26D' }}>Quiz</span>
        </Title>
        <ColorSchemeToggle />
      </Box>
      <Flex gap="md" justify="center" align="center" direction="column">
        <Image
          src={mahitdayLogo}
          alt="MahitDay Logo"
          width={800}
          height={300}
          priority
          style={{ maxWidth: '50%', height: 'auto' }}
        />
        <div style={{ margin: '1.5em' }}>
          <Divider size="sm" my="md" color="#FBB26D" sx={{ width: '30%' }} />
          <MediaQuery largerThan="lg" styles={{ marginRight: '15em' }}>
            <Title order={3}>
              โครงการตอบปัญหาวิชาการวิทยาศาสตร์สุขภาพและพระราชประวัติสมเด็จพระมหิตลาธิเบศรฯ
              <br />
              ประจำปีการศึกษา 2568
            </Title>
          </MediaQuery>
          {REGISTRATION_STAGE === 'close' && <Text c="red">ยังไม่เปิดรับสมัคร</Text>}
          {REGISTRATION_STAGE === 'open' && <Text c="green">ผู้สมัครเต็มจำนวนแล้ว</Text>}
          <Group sx={{ marginTop: '2em', marginBottom: '2em' }}>
            <Button
              component={Link}
              variant="white"
              size="xl"
              radius="xl"
              href={REGISTRATION_STAGE === 'register' ? '/dashboard/info' : '/dashboard/step4'}
              disabled={REGISTRATION_STAGE === 'close'}
              sx={{ color: '#FBB26D', borderColor: '#FBB26D' }}
            >
              {REGISTRATION_STAGE === 'register'
                ? 'สมัครสอบ'
                : REGISTRATION_STAGE === 'open'
                  ? 'เข้าสู่ระบบ'
                  : 'ปิดรับสมัคร'}
            </Button>
            <Button
              component={Link}
              variant="outline"
              size="xl"
              radius="xl"
              href="/mahitday2019mcqs.pdf"
              sx={{ color: '#FBB26D', borderColor: '#FBB26D' }}
            >
              ข้อสอบเก่า 2019
            </Button>
          </Group>
          <SocialIcons />
        </div>
        <MaxMinScore />
        <FAQ />
      </Flex>
    </main>
  );
}
