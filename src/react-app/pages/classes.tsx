import { useAuth } from "@/context/AuthContext.tsx";
import { useQuery } from "@tanstack/react-query";
import { Classes } from "../../types";
import { ClassCards } from "@/components/Classes.tsx";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queries.ts";
import { useState } from "react";
import { SkeletonTable } from "@/components/Loading.tsx";

async function getNotionData() {
  const resp = await fetch("/api/classes");
  return (await resp.json()) as Classes[];
}

async function refresh(refreshing: (state: boolean) => void) {
  refreshing(true);
  await queryClient
    .invalidateQueries({ queryKey: ["classes"] })
    .finally(() => refreshing(false));
}

export function ClassPage() {
  const { data: user, isPending: loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { isPending, data, error } = useQuery({
    queryKey: ["classes"],
    queryFn: getNotionData,
  });

  let Table = <></>;
  if (loading || refreshing || isPending) {
    Table = <SkeletonTable />;
  } else if (!user) {
    Table = <p>ERROR: No user specified</p>;
  } else if (error) {
    Table = <p>ERROR: {error.message}</p>;
  } else {
    Table = <ClassCards data={data} />;
  }
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <span className="text-xl">My Classes</span>
        <Button
          size={"icon"}
          variant="outline"
          onClick={async () => await refresh(setRefreshing)}
        >
          <RefreshCw />
        </Button>
      </div>
      {Table}
    </>
  );
}
