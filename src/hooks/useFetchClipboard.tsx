"use client";

import useSWR from "swr";
import { ClipboardItem } from "../components/ClipboardItem";
import { fetcher } from "@/app/api/utilities/fetcher";

export type FetchClipboardType = {
  data: ClipboardItem[];
  error: any;
  isLoading: boolean;
};

export function useFetchFromClipboard(): FetchClipboardType {
  const { error, data, isLoading } = useSWR("/api/clipboard", fetcher);
  return {
    error,
    data,
    isLoading,
  };
}
