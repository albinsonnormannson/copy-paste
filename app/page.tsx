import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { PasteForm } from "../components/PasteForm";
import { ClipboardItems } from "../components/ClipboardItems";
import { ClipboardContextProvider } from "../components/context/ClipboardContext";
import { InitialClipboardSWRConfig } from "../components/InitialClipboardSWRConfig";
import { getClipboardItems } from "../pages/api/controllers/clipboard.controller";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const initialClipboard = await getClipboardItems();
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <InitialClipboardSWRConfig
        fallback={{ "/api/clipboard": initialClipboard }}
      >
        <ClipboardContextProvider>
          <PasteForm />
          <ClipboardItems />
        </ClipboardContextProvider>
      </InitialClipboardSWRConfig>
    </main>
  );
}
