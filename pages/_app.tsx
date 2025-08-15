import { useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { IBM_Plex_Sans_Thai } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import Home from '../components/Home/Home';
import { REGISTRATION_STAGE } from '../utils/config';

const ibm = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  weight: ['600'],
});

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps, router } = props; // Add 'router' to props

  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  // Check if the current route is 'index', and if so, exclude SessionProvider
  const indexRoute = router.pathname === '/';

  return (
    <>
      <Head>
        <title>MahitdayQuiz</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="โครงการตอบปัญหาวิชาการวิทยาศาสตร์สุขภาพและพระราชประวัติสมเด็จพระมหิตลาธิเบศรฯ"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            colorScheme,
            fontFamily: ibm.style.fontFamily,
            colors: {
              MahitdayQuiz: [
                '#fdeaea',
                '#f9c9ca',
                '#f49fa1',
                '#ee7b7d',
                '#e6676c', // base theme color
                '#d85b61',
                '#c44f55',
                '#b0454a',
                '#9b3b3f',
                '#873135',
              ],
            },
            primaryColor: 'MahitdayQuiz',
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          {/* @ts-ignore */}
          {REGISTRATION_STAGE !== 'close' ? (
            <>
              {indexRoute ? ( // Conditionally render SessionProvider
                <Component {...pageProps} />
              ) : (
                <SessionProvider>
                  <SWRConfig
                    value={{
                      fetcher: async (...args: Parameters<typeof fetch>) => {
                        const res = await fetch(...args);
                        return res.json();
                      },
                    }}
                  >
                    <Component {...pageProps} />
                  </SWRConfig>
                </SessionProvider>
              )}
            </>
          ) : (
            <>
              <Home />
            </>
          )}
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
