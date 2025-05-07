import type {Metadata} from 'next';
import { Geist } from 'next/font/google'; // Corrected import, assuming Geist is the sans-serif one from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster for potential future use
import { DialogProvider } from "@/context/dialog-context";

const geistSans = Geist({ // Assuming Geist is the main sans font object
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <DialogProvider>
          {children}
          <Toaster />
        </DialogProvider>
      </body>
    </html>
  );
}
