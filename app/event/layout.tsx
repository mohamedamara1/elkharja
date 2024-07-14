"use client";
import useLoginDialog from "../../components/hooks/use-login";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { LoginDialogComponent, openDialog } = useLoginDialog();

  return (
    <>
      {children} <LoginDialogComponent />
    </>
  );
}
