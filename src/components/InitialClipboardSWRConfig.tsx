"use client";

import React from "react";
import { SWRConfig } from "swr";

export const InitialClipboardSWRConfig = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?:
    | {
        [key: string]: any;
      }
    | undefined;
}) => {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
};
