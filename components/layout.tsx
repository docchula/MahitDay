import { ReactNode, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  Avatar,
  Box,
} from '@mantine/core';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoginButton from './Appbar/LoginButton';
import Nav from './Appbar/Nav';
import PaginationTab from './Appbar/PaginationTab';
import { ColorSchemeToggle } from './ColorSchemeToggle/ColorSchemeToggle';
import { REGISTRATION_STAGE } from '../utils/config';
import { useRegisterStatus } from '../hooks/status';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();
  const { isAvailable } = useRegisterStatus();
  return (
    <>
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <Nav />
          </Navbar>
        }
        footer={
          <Footer height={50} p="xs">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <span>Copyright 2024, IT Division, SMCU</span>
              </MediaQuery>
               {/* @ts-ignore */}
              {(REGISTRATION_STAGE === 'register' && isAvailable) && <PaginationTab />}
              <ColorSchemeToggle />
            </div>
          </Footer>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Link href="/" passHref>
                <Button variant="subtle" size="lg">
                  AMSci
                </Button>
              </Link>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                  <Avatar src={session?.user?.image} alt="profile" radius="xl" />
                </MediaQuery>
                <LoginButton />
              </Box>
            </div>
          </Header>
        }
      >
        {children}
      </AppShell>
    </>
  );
}
