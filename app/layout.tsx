import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import NextTopLoader from 'nextjs-toploader';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BorkJud บอกจุด",
  description: "บอกจุด คือเว็บแอพที่วิเคราะห์อาการเมื่อยตามร่างกาย พร้อมแนะนำวิธีแก้เบื้องต้น และส่งข้อมูลให้หมอนวดได้",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          showSpinner={false}
          color="#cf944f"
          height={5}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
