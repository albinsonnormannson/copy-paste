import React from "react";

export const PasteInputField = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>((props, ref) => {
  return (
    <div className="flex-1 border-2 px-2 py-1 rounded-md text-sm border-gray-300">
      <input
        ref={ref}
        minLength={1}
        type="text"
        className="outline-none w-full"
        {...props}
      />
    </div>
  );
});

PasteInputField.displayName = "PasteInputField";
