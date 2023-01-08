import React, { useRef, createRef } from "react";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { FaPaste, FaCopy } from "react-icons/fa";
import { useClipboardContext } from "./context/ClipboardContext";
import { TooltipElement, TooltipRefType, useTooltip, withTooltip } from "./Tooltip";

export type ClipboardItem = {
  id: any;
  content: any;
  // createdAt: Date;
};

export const ClipboardItem = ({ value }: { value: ClipboardItem }) => {
  const copyTooltipRef = useRef<TooltipElement>(null) as TooltipRefType;
  const copyTooltip = useTooltip(copyTooltipRef);
  const { setClipboard } = useClipboardContext();

  const handleCopy = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    await navigator.clipboard.writeText(value.content);

    copyTooltip.toggleTooltip();
  };

  const handleDelete = async (id: string) => {
    fetch(`/api/clipboard/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        setClipboard((prevClipboardItems) => {
          return prevClipboardItems.filter((item) => {
            return item.id !== data.id;
          });
        });
      });
  };

  const CopyButtonWithTooltip = withTooltip(
    () => (
      <button className="text-xl text-green-700" onClick={handleCopy}>
        <FaCopy />
      </button>
    ),
    {
      style: {
        marginLeft: "auto",
      },
    }
  );

  return (
    <div className="flex py-2 px-4 mb-2 bg-orange-200 rounded-sm">
      <div className="max-w-[90%] break-words">{value.content}</div>
      {/* <span className="text-sm text-green-300">{value.createdAt.toDateString()}</span> */}
      <div style={{ marginLeft: "auto" }} className="grid place-items-center">
        <CopyButtonWithTooltip ref={copyTooltipRef}>Copied</CopyButtonWithTooltip>
        <button
          onClick={() => handleDelete(value.id)}
          className="bg-red-600 text-white rounded-full text-sm h-5 w-5 grid place-items-center"
        >
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
};
