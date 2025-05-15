import type {Metadata} from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { DialogProvider } from "@/context/dialog-context";
import { SessionProvider } from "@/context/session-context";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hello World React App',
  description: 'A simple customizable Hello World application built with Next.js and React.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <SessionProvider>
          <DialogProvider>
            {children}
            <Toaster />
          </DialogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}