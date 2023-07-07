"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useFetchFromClipboard } from "../../hooks/useFetchClipboard";
import { ClipboardItem } from "../ClipboardItem";
import toast from "react-hot-toast";

export type ClipboardContextType = {
  clipboard: ClipboardItem[];
  setClipboard: React.Dispatch<React.SetStateAction<ClipboardItem[]>>;
};

const ClipboardContext = createContext<ClipboardContextType>({
  clipboard: [],
  setClipboard: function () {},
});

export const useClipboardContext = () => {
  const clipboardItems = useContext(ClipboardContext);
  return clipboardItems;
};

export const ClipboardContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, error } = useFetchFromClipboard();
  const [clipboard, setClipboard] = useState<ClipboardItem[]>(data);
  error &&
    toast.error(error.toString(), {
      id: "initial-page-load-error",
    });

  return (
    <ClipboardContext.Provider
      value={{
        clipboard,
        setClipboard: useMemo(() => setClipboard, []),
      }}
    >
      {children}
    </ClipboardContext.Provider>
  );
};
