/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import EventEmitter from "events";
import { toast } from "sonner";
import { useGetHeaders } from "./use-get-headers";
import { signOut } from "next-auth/react";
import { routes } from "../routes";

export const sessionEventEmitter = new EventEmitter();
interface Header extends AxiosRequestConfig {
  headers: {
    "Content-Type": string;
    Accept: string;
    Authorization: string;
  };
}

// --- Prevent API requests while offline ---
axios.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      toast.error("No internet connection");

      return Promise.reject({
        isOffline: true,
        message: "No internet connection",
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- Axios interceptor ---
axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403 || status === 424) {
      const pathname = window.location.pathname;

      // Don't do anything if already on an auth page
      const isAuthPage = [
        routes.signIn,
        routes.signOut,
        routes.signUp,
        routes.error,
      ].includes(pathname);

      if (!isAuthPage) {
        toast.error("Unauthorized Access. Log in again.");

        // Prevent multiple requests from triggering multiple redirects
        window.location.replace(routes.signIn);
      }
    }

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
        const errorMessage =
          (error as any)?.response?.data?.detail ||
          (error as any)?.response?.data?.error;
        const isString = typeof errorMessage === "string";
        const errors = (error as any)?.response?.data?.errors?.join(", ");

        toast.error(
          isString
            ? errorMessage
            : errors || "We couldn't complete your request. Please try again.",
        );
      }
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: true,
    enabled: enabled,
  });
};
