import { AppShell, Header, Footer, useMantineTheme, Button, MediaQuery, Menu, Burger } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const links = [
    { href: '/admin/students', text: 'Students' },
    { href: '/admin/teams', text: 'Teams' },
    { href: '/admin/users', text: 'Users' },
    { href: '/admin/verification', text: 'Verification' },
    { href: '/admin/edit', text: 'Edit Users' },
    // { href: '/admin/verifyspecific', text: 'Verify Team' },
    // { href: '/admin/update', text: 'Update Team' },
  ];
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      footer={
        <Footer height={60} p="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <div>Copyright 2024, IT Division, SMCU</div>
            </MediaQuery>
            <div>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Burger opened={false} />
                </Menu.Target>
                <Menu.Dropdown>
                  {links.map((linkInfo) => (
                    <Link key={linkInfo.text} href={linkInfo.href} style={{ textDecoration: 'none' }}>
                      <Menu.Item>
                        {linkInfo.text}
                      </Menu.Item>
                    </Link>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </div>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <div>
                <ColorSchemeToggle />
              </div>
            </MediaQuery>
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
            <Link href="/admin" passHref>
              <Button variant="subtle" size="lg">
                AMSci Admin
              </Button>
            </Link>
            <Button variant="default" size="md" onClick={() => signOut()}>
              <IconLogout />
            </Button>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
