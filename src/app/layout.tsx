import { InitialClipboardSWRConfig } from "@/components/InitialClipboardSWRConfig";
import { Navbar } from "../components/Navbar";
import "./globals.css";
import styles from "./page.module.css";
import { ClipboardContextProvider } from "@/components/context/ClipboardContext";
import { Inter } from "next/font/google";
import { getCombinedClipboardItems } from "./api/clipboard/utilities";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialClipboard = await getCombinedClipboardItems();
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Navbar />
        <main className={`${styles.main} ${inter.className}`}>
          <InitialClipboardSWRConfig
            // superjson stopped working?
            // data-superjson
            fallback={{ "/api/clipboard": initialClipboard }}
          >
            <ClipboardContextProvider>{children}</ClipboardContextProvider>
          </InitialClipboardSWRConfig>
        </main>
      </body>
    </html>
  );
}
