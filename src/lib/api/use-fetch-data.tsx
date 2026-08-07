/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import EventEmitter from "events";
import { toast } from "sonner";
import { useGetHeaders } from "./use-get-headers";

export const sessionEventEmitter = new EventEmitter();
interface Header extends AxiosRequestConfig {
  headers: {
    "Content-Type": string;
    Accept: string;
    Authorization: string;
  };
}

// --- Axios interceptor ---
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    //signout
    return Promise.reject(error);
  },
);


export const useFetchData = (
  queryKey: (string | number | boolean | undefined | null | any)[],
  url: string,
  headers?: Header["headers"] | any,
  enabled?: boolean,
) => {
  const header = useGetHeaders({});
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
          headers: headers ?? header,
        });
        return response.data
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: true,
    enabled: enabled,
  });
};
