import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Teko } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/LenisProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const teko = Teko({
  variable: '--font-teko',
  subsets: ['devanagari', 'latin'],
  weight: ['700'],
});

import SEO from '@/components/SEO';

export const metadata: Metadata = {
  title: 'Rohan Krishnagoudar | System Architect',
  description: 'System Architect & Co-Founder @ Explyra. High-performance computing and cloud infrastructure.',
  openGraph: {
    title: 'Rohan Krishnagoudar | System Architect',
    description: 'System Architect & Co-Founder @ Explyra.',
    images: ['/image.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohan Krishnagoudar | System Architect',
    description: 'System Architect & Co-Founder @ Explyra.',
    images: ['/image.jpeg'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${teko.variable} h-full antialiased dark`}
    >
      <head>
        <SEO />
      </head>
      <body className="min-h-full flex flex-col bg-black text-[#e5e5e5] selection:bg-[#00f3ff]/30 selection:text-[#00f3ff]">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
