"use client";

import React from "react";
import { FaClipboard } from "react-icons/fa";

type PasteButtonType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { onPasteFromClipboard?: (text: string) => void };
export const PasteButton = ({ ...props }: PasteButtonType) => {
  const { onPasteFromClipboard } = props;
  //   Deleting the prop before passing it to the html element because it is not a standard event handler or attribute as the browser will complain when passed
  delete props.onPasteFromClipboard;

  const handlePasteFromClipboard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (navigator.clipboard) {
      navigator.clipboard
        .readText()
        .then((text: string) => {
          onPasteFromClipboard && onPasteFromClipboard(text);
        })
        .catch((e) => {
          alert(
            "This functionality requires clipboard read access. Please allow clipboard read for this site"
          );
        });
    } else {
      alert("Paste recent button not working");
    }
  };

  return (
    <button
      {...props}
      onClick={handlePasteFromClipboard}
      title="Paste most recent from clipboard"
      className="border-solid bg-green-700 rounded-md text-gray-300 px-3 py-2 ml-2 "
    >
      <FaClipboard />
    </button>
  );
};
