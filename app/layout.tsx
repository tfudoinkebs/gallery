import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Us, But Make It Art",
  description:
    "A gallery of our mess—the laughs, the love, the chaos, and all the little moments that make us us.",
  icons: {
    icon: [
      {
        url: "/logo-01.png",
        type: "image/png",
      },
    ],
    shortcut: ["/logo-01.png"],
    apple: [
      {
        url: "/logo-01.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
