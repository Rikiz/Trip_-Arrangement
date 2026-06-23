import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "旅行规划助手 — 一起来计划下次旅行",
  description: "收集朋友们的旅行偏好，智能推荐最佳行程方案",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <div className="fixed inset-0 -z-10 bg-[var(--background)]">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 50%)`,
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </div>
        {children}
      </body>
    </html>
  );
}
