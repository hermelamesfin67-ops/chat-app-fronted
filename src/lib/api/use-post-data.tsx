/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosProgressEvent,
} from "axios";
import { toast } from "sonner";
import { useGetHeaders } from "./use-get-headers";

type MutationOptions = {
  url: string;
  method: AxiosRequestConfig["method"];
  body?: any;
  headers?: AxiosRequestConfig["headers"];
  onSuccess?: (data: AxiosResponse["data"]) => void;
  onError?: (error: Error) => void;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

const useDynamicMutation = ({
  type = "Json",
}: {
  type?: "FormData" | "Json";
  noEnc?: boolean;
}) => {
  const header = useGetHeaders({ type });
  const dynamicMutation = useMutation({
    mutationFn: async (options: MutationOptions) => {
      const {
        url,
        method,
        body,
        headers,
        onUploadProgress,
        onDownloadProgress,
      } = options;

      const response = await axios.request({
        url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        method,
        headers: headers || header,
        data: body,
        onUploadProgress,
        onDownloadProgress,
      });
      return response.data;
    },
    onSuccess: async (data, variables) => {
      const response = data
      if (variables.onSuccess) {
        variables.onSuccess(response);
      }
    },
    onError: async (error, variables) => {
      if (variables.onError) {
        variables.onError(error);
      }
      const errorMessage =
        (error as any)?.response?.data?.detail ||
        (error as any)?.response?.data?.error;
      const isString = typeof errorMessage === "string";
      const errors = (error as any)?.response?.data?.error?.message;
      toast.error(
        isString
          ? errorMessage
          : errors || "We couldn't complete your request. Please try again.",
      );
    },
    retry: false,
  });

  return dynamicMutation;
};

export default useDynamicMutation;
