"use client";

import React, { useRef } from "react";
import { PasteInputField } from "../components/PasteInputField";
import toast from "react-hot-toast";

import { PasteButton } from "../components/PasteButton";
import { useState } from "react";
import { useClipboardContext } from "./context/ClipboardContext";
import { AiOutlineSend } from "react-icons/ai";
import { TooltipElement, useTooltip, withTooltip } from "./Tooltip";
import { SendButton } from "./SendButton";

export const PasteForm = () => {
  const [pasteInputField, setPasteInputField] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const pasteInputElement = useRef<HTMLInputElement>(null);
  const { setClipboard } = useClipboardContext();
  const sentTooltipRef = useRef<TooltipElement>(null);
  const sentTooltip = useTooltip(sentTooltipRef);

  const handlePasteFromClipboard = (text: string) => {
    setPasteInputField(text);
    // pasteInputElement.current?.focus();
  };

  const handlePaste = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
      | undefined
  ) => {
    setSubmitting(true);
    e && e.preventDefault();
    if (pasteInputField === "") {
      return;
    }
    sentTooltip.toggleTooltip("Sending");
    const responsePromise = fetch("/api/clipboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: pasteInputField,
      }),
    });
    toast.promise(
      responsePromise,
      {
        loading: "Sending",
        success: "Sent",
        error: "Error pasting new item to clipboard",
      },
      {
        id: "sending-item-toast",
      }
    );
    const res = await responsePromise;
    if (res.ok) {
      const newClipboardItem = await res.json();
      setClipboard((prevClipboardItems) => [
        newClipboardItem,
        ...prevClipboardItems,
      ]);
      setPasteInputField("");
    } else {
      const { message } = await res.json();
      toast.remove();
      toast.error(message, {
        id: "sending-item-toast",
      });
    }
    setSubmitting(false);
    // pasteInputElement.current?.focus();
  };
  // const SendButtonWithTooltip = withTooltip(() => (
  //   <SendButton handlePaste={handlePaste} />
  // ));
  return (
    <form
      onSubmit={(e) => handlePaste(e)}
      className="flex items-center my-3 w-full"
    >
      {/* <div> */}
      <PasteInputField
        ref={pasteInputElement}
        value={pasteInputField}
        onChange={(e) => setPasteInputField(e.target.value)}
      />
      {/* <div className="my-5"> */}
      <PasteButton
        type="button"
        onPasteFromClipboard={handlePasteFromClipboard}
      />
      <SendButton disabled={submitting} handlePaste={handlePaste} />
      {/* </div> */}
      {/* </div> */}
    </form>
  );
};
