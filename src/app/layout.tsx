import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PromptProvider } from "@/contexts/PromptContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import GlobalNavbar from "@/components/navigation/GlobalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 프롬프트 워크스페이스 - 프롬프트 라이브러리 & 스터디",
  description: "AI 프롬프트를 체계적으로 관리하고, 프롬프트 엔지니어링을 학습할 수 있는 통합 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CategoryProvider>
          <PromptProvider>
            <GlobalNavbar />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </PromptProvider>
        </CategoryProvider>
      </body>
    </html>
  );
}
