"use client";

import { useState } from "react";
import { MutationOptions, MutationState, UseMutationReturn } from "./types";

export function useMutation<TData, TVariables, TError = unknown>(
  options: MutationOptions<TData, TVariables, TError>
): UseMutationReturn<TData, TVariables, TError> {
  const { mutationFn, onMutate, onSuccess, onError } = options;

  const [state, setState] = useState<MutationState<TData, TError>>({
    status: "idle",
    data: undefined,
    error: undefined,
    isLoading: false,
    message: undefined,
  });

  const mutate = async (variables: TVariables) => {
    setState({ ...state, status: "pending", isLoading: true });

    try {
      if (onMutate) await onMutate(variables);
      const response = await mutationFn(variables);

      let data: TData | undefined;

      if (typeof response === "undefined") {
        setState({
          status: "success",
          message: {
            text: "Success",
            type: "success",
          },
          isLoading: false,
        });
      } else {
        data = "data" in response ? response?.data : undefined;
        const message =
          "error" in response
            ? response?.error
            : "success" in response
            ? response?.success
            : "";
        setState({
          status: "success",
          data,
          message: {
            type: "success",
            text: message || "Success!",
          },
          isLoading: false,
        });
      }

      if (onSuccess) onSuccess(data, variables);
    } catch (error: any) {
      setState({
        status: "error",
        error,
        message: {
          type: "error",
          text: error instanceof Error ? error.message : "Unknown error.",
        },
        isLoading: false,
      });

      if (onError) onError(error as TError, variables);
    }
  };

  return { ...state, mutate };
}
