import React, { createContext, useState, useContext } from "react";

type TooltipContextType = {
  tooltipContent: React.ReactNode;
  setTooltipContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

const TooltipContext = createContext<TooltipContextType>({
  tooltipContent: "",
  setTooltipContent: () => {},
});

export const TooltipContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("");

  return (
    <TooltipContext.Provider
      value={{
        tooltipContent,
        setTooltipContent,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltipContext = () => {
    return useContext(TooltipContext);
}
