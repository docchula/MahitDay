import { Container, SimpleGrid, Text, Loader, Paper, Center, Divider } from '@mantine/core';
import classes from './MaxMinScore.module.css';
import { useEffect, useState } from 'react';

// --- Type Definitions ---
type Student = {
  student_score: number;
};

// --- Feature Component ---
function Feature({ title, score }: { title: string; score: number | null }) {
  return (
    <Paper
      radius="lg"
      shadow="xl"
      className={classes.feature}
      p="xl"
      withBorder
      style={{ padding: '32px 24px' }} // Add more padding to each card
    >
      <div className={classes.centerContent}>
        <Text fw={700} fz={20} mb={12} className={classes.title}>
          {title}
        </Text>
        <Text fz={20} fw={900} className={classes.score} style={{ padding: '16px 0' }}>
          {score !== null ? score : 'N/A'}
        </Text>
      </div>
    </Paper>
  );
}

// --- Main Component ---
export default function MaxMinScore() {
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState<number | null>(null);
  const [minScore, setMinScore] = useState<number | null>(null);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await fetch('/api/team-score-public');
        const data = await res.json();

        const students: Student[] = [];
        if (Array.isArray(data)) {
          data.forEach((team) => {
            if (team.student1 && team.student1.student_score != null) students.push(team.student1);
            if (team.student2 && team.student2.student_score != null) students.push(team.student2);
          });

          if (students.length > 0) {
            const scores = students.map((s) => s.student_score);
            setMaxScore(Math.max(...scores));
            setMinScore(Math.min(...scores));
          } else {
            setMaxScore(null);
            setMinScore(null);
          }
        }
      } catch (e) {
        setMaxScore(null);
        setMinScore(null);
      }
      setLoading(false);
    }
    fetchScores();
  }, []);

  const items = [
    {
      title: 'Max Team Score',
      score: maxScore,
    },
    {
      title: 'Min Team Score',
      score: minScore,
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
        คะแนนสูงสุดและต่ำสุด
      </Text>
      <Divider my={16} color="gray.3" />
      {loading ? (
        <Center style={{ height: 120 }}>
          <Loader size="lg" color="blue" />
        </Center>
      ) : (
        <SimpleGrid cols={2} spacing={40}>
          {items.map((item) => (
            <Feature {...item} key={item.title} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
