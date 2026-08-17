import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin","cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin","cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://serviceflow.openai.site"),
  title: "ServiceFlow — CRM для сервисного центра",
  description: "Заявки, мастера, клиенты и автоматизации в едином рабочем потоке.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "ServiceFlow", description: "Сервис под контролем.", images: [{ url: "/og.png", width: 1792, height: 938 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ru"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
