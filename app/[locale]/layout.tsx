import 'swiper/css';
import 'swiper/css/navigation';
import "./globals/index.scss";
import { AntdRegistry } from '@ant-design/nextjs-registry';

import type { Metadata } from "next";
import localFont from "next/font/local";
import LayoutHeader from "../components/layouts/header";

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

import AppProvider from "../components/appProvider";
import ThemeProvider from "../components/themeProvider";
import { CookiesProvider } from 'next-client-cookies/server';

import StoreProvider from "../components/storeProvider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Z-Forms",
  description: "Generated by uzbek developer",
  category: 'forms',
};



async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={params.locale} >
      <head>
        <link rel="icon" type='image/jpeg' href="/favicon.jpg" />
      </head>
      <CookiesProvider>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <AntdRegistry>
              <body className={`${geistSans.variable} ${geistMono.variable} app-body`}>
                <ThemeProvider>
                  <AppProvider locale={params.locale}>
                    <LayoutHeader></LayoutHeader>
                    {children}
                  </AppProvider>
                </ThemeProvider>
              </body>
            </AntdRegistry>
          </NextIntlClientProvider>
        </StoreProvider>
      </CookiesProvider>
    </html>
  );
}

export default RootLayout;