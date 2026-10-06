import { useAuth } from "@/context/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queries.ts";
import { useState } from "react";
import { SkeletonTable } from "@/components/Loading.tsx";
import { ILLTable } from "@/components/interlibraryloan.tsx";
import { useILL } from "@/context/ILLContext.ts";

async function refresh(refreshing: (state: boolean) => void) {
  refreshing(true);
  await queryClient
    .invalidateQueries({ queryKey: ["ill"] })
    .finally(() => refreshing(false));
}

export function ILL() {
  const { user, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { isPending, data, error } = useILL();

  let Table = <></>;
  if (loading || refreshing || isPending) {
    Table = <SkeletonTable />;
  } else if (!user) {
    Table = <p>ERROR: No user specified</p>;
  } else if (error) {
    Table = <p>ERROR: {error.message}</p>;
  } else {
    Table = <ILLTable data={data} />;
  }
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <span className="text-xl">My Interlibrary Loan Requests</span>
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
