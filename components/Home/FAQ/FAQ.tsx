import { Accordion, Box, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { faqs } from '../../../utils/constant-lists';
import faqImage from '../../../public/faq.png';
import faqExampleImage from '../../../public/faq-example.png';

export default function FAQ() {
  const items = faqs.map((faq) => (
    <Accordion.Item key={faq.question} value={faq.answer}>
      <Accordion.Control>
        <Text fw={600}>Q: {faq.question}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        {faq.answer.split('\n').map((line) => (
          <Text key={line} mb="xs">
            {line}
          </Text>
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '95%' }}>
        {/*<Text
          size="xl"
          fw={800}
          align="center"
          mt={80}
          mb={80}
          sx={{
            fontSize: '3rem',
            color: '#888',
          }}
        >
          - Coming Soon -
        </Text>*/}

        <Image
          src={faqImage}
          alt="FAQ Picture"
          width={998}
          height={458}
          style={{
            width: '50%',
            height: 'auto',
          }}
        />
        <Image
          src={faqExampleImage}
          alt="FAQ Example"
          width={1680}
          height={718}
          style={{
            width: '90%',
            maxWidth: '100em',
            height: 'auto',
          }}
        />
        <Accordion sx={{ width: '90%', maxWidth: '100em', marginBottom: '3em' }}>{items}</Accordion>
      </Box>
    </>
  );
}
