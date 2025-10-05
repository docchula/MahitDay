import { Container, SimpleGrid, Text, Paper, Divider, Center } from '@mantine/core';
import classes from './MaxMinScore.module.css';

// --- Feature Component ---
function Feature({ title, score }: { title: string; score: number }) {
  return (
    <Paper
      radius="lg"
      shadow="xl"
      className={classes.feature}
      p="xl"
      withBorder
      style={{ padding: '32px 24px' }}
    >
      <div className={classes.centerContent}>
        <Text fw={700} fz={20} mb={12} className={classes.title}>
          {title}
        </Text>
        <Text fz={20} fw={900} className={classes.score} style={{ padding: '16px 0' }}>
          {score}
        </Text>
      </div>
    </Paper>
  );
}

// --- Main Component ---
export default function MaxMinScore() {
  const items = [
    {
      title: 'Max Team Score',
      score: 36,
    },
    {
      title: 'Min Team Score',
      score: 18,
    },
  ];

  return (
    <Container mt={40} mb={40} size="md">
      <Text
        fw={900}
        size={20}
        mb={8}
        ta="center"
        className={classes.header}
        style={{ letterSpacing: 1 }}
      >
        คะแนนสูงสุดและต่ำสุดประจำปีการศึกษา 2568
      </Text>
      <Divider my={16} color="gray.3" />
      <SimpleGrid cols={2} spacing={40}>
        {items.map((item) => (
          <Feature {...item} key={item.title} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
