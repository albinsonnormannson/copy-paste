"use client";

import { ClipboardItem as DatabaseClipboardType } from "@prisma/client";
import React, { useRef } from "react";
import toast from "react-hot-toast";
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
import { deleteRemoteClipboardItemReturnType } from "@/app/api/clipboard/utilities";

export type ClipboardItem = DatabaseClipboardType;

export const ClipboardItem = ({ value }: { value: ClipboardItem }) => {
  const copyTooltipRef = useRef<TooltipElement>(null) as TooltipRefType;
  const copyTooltip = useTooltip(copyTooltipRef);
  const { setClipboard } = useClipboardContext();
  // const [itemVisible, setItemVisible] = useState(value.visible);

  const handleCopy = async (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value.content);

      copyTooltip.toggleTooltip();
    } else {
      toast.error(
        "Cannot copy to clipboard at this time, please give permissions"
      );
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { id, remote } = value;
    try {
      const responsePromise = fetch(`/api/clipboard`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          id,
          remote,
        }),
      });
      toast.promise(
        responsePromise,
        {
          success: "Clipboard item deleted successfully",
          error: "Error deleting item... check your internet",
          loading: "Deleting...",
        },
        {
          id: "deleting-toast",
        }
      );
      const res = await responsePromise;
      if (res.ok) {
        const deletedItem: Awaited<deleteRemoteClipboardItemReturnType> =
          await res.json();
        setClipboard((prevClipboardItems) => {
          const newClipboardItems = prevClipboardItems.filter((item) => {
            return deletedItem.id != item.id;
          });
          return newClipboardItems;
        });
      } else {
        const error = await res.json();
        toast.error(`Error deleting item ${error.message}`, {
          id: "deleting-toast",
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const toggleItemVisibility: React.MouseEventHandler<
    HTMLButtonElement
  > = async (e) => {
    // TODO: IMPLEMENT DISABLING THE TOGGLE VISIBILITY BUTTON WHILE REQUEST IS BEING MADE
    if (e.target instanceof HTMLButtonElement) {
      e.target.disabled = true;
    }
    const promiseResponse = fetch("/api/clipboard", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        id: value.id,
        visible: !value.visible,
        remote: value.remote,
      }),
    });

    toast.promise(
      promiseResponse,
      {
        loading: `Changing visibility to: ${
          value.visible ? "invisible" : "visible"
        }`,
        error: "Could not change item visibility",
        success: `Item is now ${value.visible ? "invisible" : "visible"}`,
      },
      {
        id: `toggleVisibilityToast${value.id}`,
      }
    );

    const res = await promiseResponse;
    if (res.ok) {
      const data = await res.json();
      setClipboard((prevClipboardItems) => {
        return prevClipboardItems.map((prevClipboardItem) => {
          if (prevClipboardItem.id === value.id) {
            return data;
          }
          return prevClipboardItem;
        });
      });
    } else {
      toast.error("Unable to update item visibility", {
        id: `toggleVisibilityToast${value.id}`,
      });
    }
    if (e.target instanceof HTMLButtonElement) {
      e.target.disabled = false;
    }
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
    <div
      className="flex py-2 px-4 mb-2 bg-orange-200 rounded-sm cursor-pointer"
      onClick={handleCopy}
    >
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
          onClick={handleDelete}
          className="bg-red-600 text-white rounded-full text-sm h-5 w-5 grid place-items-center"
        >
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
};
