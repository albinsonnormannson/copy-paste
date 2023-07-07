import React from "react";
import { AiOutlineSend } from "react-icons/ai";

export const SendButton = ({
  handlePaste,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  handlePaste: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
      | undefined
  ) => void;
}) => {
  return (
    <button
      {...props}
      onClick={handlePaste}
      className="border-solid ml-2 rounded-md bg-green-700 text-gray-300 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <AiOutlineSend />
    </button>
  );
};
