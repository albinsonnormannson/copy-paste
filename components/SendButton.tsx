import React from "react";
import { AiOutlineSend } from "react-icons/ai";

export const SendButton = ({ handlePaste }: {
    handlePaste: (e:
        | React.MouseEvent<HTMLButtonElement>
        | React.FormEvent<HTMLFormElement>
        | undefined) => void
}) => {
  return (
    <button
      onClick={handlePaste}
      className="border-solid ml-2 rounded-md bg-green-700 text-gray-300 px-3 py-2"
    >
      <AiOutlineSend />
    </button>
  );
};
