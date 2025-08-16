import { useEffect, useState } from 'react';
import { Button, Text } from '@mantine/core';
import ConsentForm from '../../components/Form/ConsentForm/ConsentForm';
import Layout from '../../components/layout';
import { useStatus } from '../../hooks/status';

export default function index() {
  const { isAgree } = useStatus();
  const [initialAgree, setInitialAgree] = useState(false);
  useEffect(() => {
    setInitialAgree(isAgree);
  }, []);
  return (
    <>
      <Layout>
        <Text>
          กติกาและข้อตกลงในการแข่งขัน ผู้สมัครสามารถศึกษากติกากำหนดการแข่งขันได้ที่
          {/* <a href="https://drive.google.com/file/d/10zizcL6U5bX2itVkCpx1nUvuhdtoqMm8/view?usp=sharing" target="_blank" rel="noopener noreferrer"> */}
          <a href="/guide-MahitdayQuiz-2025.pdf" target="_blank" rel="noopener noreferrer">
            <Button variant="subtle" compact>
              กติกาการแข่งขันฉบับเต็ม
            </Button>
          </a>
        </Text>
        {!isAgree && !initialAgree && <ConsentForm />}
      </Layout>
    </>
  );
}
