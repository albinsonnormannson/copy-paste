import { PasteForm } from "../components/PasteForm";
import { ClipboardItems } from "../components/ClipboardItems";
import { ClipboardContextProvider } from "../components/context/ClipboardContext";
import { InitialClipboardSWRConfig } from "../components/InitialClipboardSWRConfig";
import { ToastComponent } from "../components/ToastComponent";
import { Inter } from "next/font/google";
import {
  getClipboardItems,
  getCombinedClipboardItems,
} from "./api/clipboard/utilities";

export default async function Home() {
  return (
    <>
      <PasteForm />
      <ClipboardItems />
      <ToastComponent />
    </>
  );
}
