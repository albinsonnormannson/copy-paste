/* eslint-disable react/display-name */
import React, { useEffect, useRef, forwardRef, useState } from "react";
import { useForwardRef } from "../hooks/useForwardRef";

type TooltipProps = {
  children?: string;
  timeout?: number;
};

export type TooltipRefType = React.RefObject<HTMLDivElement>;

export type TooltipElement = HTMLDivElement;

const TooltipElement = forwardRef<TooltipElement, TooltipProps>(
  ({ children, timeout }, ref) => {
    const forwardedRef = useForwardRef(ref) as TooltipRefType;

    return (
      <div
        data-show="false"
        data-timeout={timeout}
        ref={forwardedRef}
        data-content={children}
        className="before:absolute before:top-0 before:left-[50%] before:-translate-x-[50%] before:border-transparent before:border-b-black pointer-events-none -z-[1] data-[show='true']:opacity-1 data-[show='false']:opacity-0 data-[show='false']:-z-index-[1] absolute top-6 text-xs text-gray-200 bg-black p-1 rounded-sm opacity-0 tooltip"
      >
        {children}
      </div>
    );
  }
);

const Tooltip = forwardRef<TooltipElement, TooltipProps>(
  ({ children, timeout = 2000 }, ref) => {
    return (
      <TooltipElement ref={ref} timeout={timeout}>
        {children}
      </TooltipElement>
    );
  }
);

const useTooltip = (tooltipRef: TooltipRefType) => {
  const toggleTooltip = (content?: TooltipProps["children"]) => {
    if (content) {
      setTooltip(content);
    }
    if (tooltipRef.current) {
      tooltipRef.current.dataset.show! = "true";
      const timeout = Number(tooltipRef.current.dataset.timeout);

      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.dataset.show! = "false";
        }
      }, timeout);
    }
  };

  const setTooltip = (content: TooltipProps["children"]) => {
    if (tooltipRef.current && content) {
      tooltipRef.current.textContent = content;
      tooltipRef.current.dataset.content = content;
    }
  };

  const showTooltip = (content?: TooltipProps["children"]) => {
    if (content) {
      setTooltip(content);
    }
    if (tooltipRef.current) {
      tooltipRef.current.dataset.show = "true";
    }
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      const timeout: any = tooltipRef.current.dataset.timeout!;
      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.dataset.show! = "false";
        }
      }, timeout);
    }
  };

  return { toggleTooltip, setTooltip, showTooltip, hideTooltip };
};

export { useTooltip };

export const withTooltip = (
  Element: () => JSX.Element,
  props?: React.DetailedHTMLProps<
    React.HTMLAttributes<TooltipElement>,
    TooltipElement
  >
) => {
  return React.memo(
    forwardRef<TooltipElement, TooltipProps>(({ children, timeout }, ref) => {
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
    })
  );
};
