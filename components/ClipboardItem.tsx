import { ClipboardItem as DatabaseClipboardType } from "@prisma/client";
import React, { useRef, useState } from "react";
import {
  AiFillDelete,
  AiOutlineDelete,
  AiFillEyeInvisible,
  AiFillEye,
} from "react-icons/ai";
import { FaPaste, FaCopy } from "react-icons/fa";
import { useClipboardContext } from "./context/ClipboardContext";
import {
  TooltipElement,
  TooltipRefType,
  useTooltip,
  withTooltip,
} from "./Tooltip";

export type ClipboardItem = DatabaseClipboardType;

export const ClipboardItem = ({ value }: { value: ClipboardItem }) => {
  const copyTooltipRef = useRef<TooltipElement>(null) as TooltipRefType;
  const copyTooltip = useTooltip(copyTooltipRef);
  const { setClipboard } = useClipboardContext();
  // const [itemVisible, setItemVisible] = useState(value.visible);

  const handleCopy = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    await navigator.clipboard.writeText(value.content);

    copyTooltip.toggleTooltip();
  };

  const handleDelete = async (id: number) => {
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

  const toggleItemVisibility = (e: any) => {
    e.target.disabled = true;
    fetch("/api/clipboard", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        id: value.id,
        visible: !value.visible,
        remote: value.remote,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClipboard((prevClipboardItems) => {
          return prevClipboardItems.map((prevClipboardItem) => {
            if (prevClipboardItem.id === value.id) {
              return data;
            }
            return prevClipboardItem;
          });
        });
      })
      .catch((e) => {
        alert("Unable to update item visibility");
      })
      .finally(() => {
        e.target.disabled = false;
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
      <div
        className="max-w-[90%] flex flex-col"
        style={{ flexDirection: "column" }}
      >
        <div className="break-words">
          {value.visible ? value.content : "***"}
        </div>
        <span className="text-xs text-green-900">
          {new Date(value.createdAt).toDateString()} |{" "}
          {value.remote ? "remote" : "local"}
          <button className="mr-3 text-sm" onClick={toggleItemVisibility}>
            {value.visible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </span>
      </div>
      <div style={{ marginLeft: "auto" }} className="grid place-items-center">
        <CopyButtonWithTooltip ref={copyTooltipRef}>
          Copied
        </CopyButtonWithTooltip>
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
