/* eslint-disable react/display-name */
import React, { useEffect, useRef, forwardRef } from "react";
import { useForwardRef } from "../hooks/useForwardRef";
import {
  TooltipContextProvider,
  useTooltipContext,
} from "./context/TooltipContext";

type TooltipProps = {
  children?: React.ReactNode;
  timeout?: number;
};

type TooltipRefType = React.RefObject<HTMLDivElement>;

export type TooltipElement = HTMLDivElement;

const TooltipElement = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, timeout }, ref) => {
    const { tooltipContent } = useTooltipContext();
    // console.log(tooltipContent);
    let tooltip = tooltipContent || children;

    return (
      <div
        data-show="false"
        data-timeout={timeout}
        ref={ref}
        data-content={tooltipContent}
        className="before:absolute before:top-0 before:left-[50%] before:-translate-x-[50%] before:w-10 before:h-10 before:rotate-45 before:bg-black pointer-events-none -z-[1] data-[show='true']:opacity-1 data-[show='false']:opacity-0 data-[show='false']:-z-index-[1] absolute top-6 text-xs text-gray-200 bg-black p-1 rounded-sm opacity-0 tooltip"
      >
        {tooltip}
      </div>
    );
  }
);

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, timeout }, ref) => {
    return (
      <TooltipContextProvider>
        <TooltipElement ref={ref} timeout={timeout}>
          {children}
        </TooltipElement>
      </TooltipContextProvider>
    );
  }
);

Tooltip.defaultProps = {
  timeout: 2000,
};

const useTooltip = (tooltipRef: TooltipRefType) => {
  const { setTooltipContent } = useTooltipContext();

  const toggleTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.dataset.show! = "true";
      // @FIXME: REMOVE ANY TYPE DEFINITION
      const timeout: any = tooltipRef.current.dataset.timeout!;

      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.dataset.show! = "false";
        }
      }, timeout);
    }
  };

  const setTooltip = (render: React.ReactNode) => {
    if (tooltipRef.current) {
      setTooltipContent(render);
    }
  };

  return { toggleTooltip };
};

export { useTooltip };

export const withTooltip = (
  Element: () => JSX.Element,
  props?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => {
  return forwardRef<TooltipElement, TooltipProps>(
    ({ children, timeout }, ref) => {
      return (
        <div
          {...props}
          className={`relative z-[999] ${
            props?.className ? props.className : ""
          }`}
        >
          <Element />
          <Tooltip ref={ref} timeout={timeout}>
            {children}
          </Tooltip>
        </div>
      );
    }
  );
};
