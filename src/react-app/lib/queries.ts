import { QueryClient } from "@tanstack/react-query";

const TIME = 60 * 1000 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TIME,
    },
  },
});
