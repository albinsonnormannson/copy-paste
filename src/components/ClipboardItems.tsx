"use client";

import React from "react";
import { ClipboardItem } from "./ClipboardItem";
import { useClipboardContext } from "./context/ClipboardContext";

// type ClipboardItems = {
//     children: React.ReactNode
// }

export const ClipboardItems = () => {
  const { clipboard } = useClipboardContext();
  const clipboardItems = clipboard?.map((clipboardItem: ClipboardItem) => (
    <ClipboardItem
      key={`${clipboardItem.remote ? "remote" : "local"}-${clipboardItem.id}`}
      value={clipboardItem}
    />
  ));
  return <div className="flex-1 self-stretch">{clipboardItems}</div>;
};
