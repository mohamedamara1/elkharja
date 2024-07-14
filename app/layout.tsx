import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";
import useLoginDialog from "../components/hooks/use-login";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rahom ta3bouni",
  description: "fhemtni 3ad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
