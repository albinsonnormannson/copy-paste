"use client";

import React, { useRef } from "react";
import { PasteInputField } from "../components/PasteInputField";

import { PasteButton } from "../components/PasteButton";
import { useState } from "react";
import { useClipboardContext } from "./context/ClipboardContext";
import { AiOutlineSend } from "react-icons/ai";
import { TooltipElement, useTooltip, withTooltip } from "./Tooltip";
import { SendButton } from "./SendButton";

export const PasteForm = () => {
  const [pasteInputField, setPasteInputField] = useState("");
  const { setClipboard } = useClipboardContext();
  const sentTooltipRef = useRef<TooltipElement>(null);
  const sentTooltip = useTooltip(sentTooltipRef);
  const handlePaste = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
      | undefined
  ) => {
    e && e.preventDefault();
    if (pasteInputField === "") {
      return;
    }
    sentTooltip.toggleTooltip("Sending");
    const newClipboardItem = fetch("/api/clipboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: pasteInputField,
      }),
    })
      .then((res) => res.json())
      .then((newClipboardItem) => {
        setClipboard((prevClipboardItems) => [
          newClipboardItem,
          ...prevClipboardItems,
        ]);
        setPasteInputField("");
        sentTooltip.toggleTooltip("Sent");
      })
      .catch((e) => alert(e));
  };

  const SendButtonWithTooltip = withTooltip(() => (
    <SendButton handlePaste={handlePaste} />
  ));
  return (
    <form
      onSubmit={(e) => handlePaste(e)}
      className="flex items-center my-3 w-full"
    >
      {/* <div> */}
      <PasteInputField
        value={pasteInputField}
        onChange={(e) => setPasteInputField(e.target.value)}
      />
      {/* <div className="my-5"> */}
      <PasteButton onPasteFromClipboard={(text) => setPasteInputField(text)} />
      <SendButtonWithTooltip ref={sentTooltipRef}>Sent</SendButtonWithTooltip>
      {/* </div> */}
      {/* </div> */}
    </form>
  );
};
