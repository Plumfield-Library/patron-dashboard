import { useQuery } from "@tanstack/react-query";
import { IllTitle } from "../../types";
export async function getNotionData() {
  const resp = await fetch("/api/ill");
  return (await resp.json()) as IllTitle[];
}

export function useILL() {
  return useQuery({
    queryKey: ["ill"],
    queryFn: getNotionData,
  });
}
