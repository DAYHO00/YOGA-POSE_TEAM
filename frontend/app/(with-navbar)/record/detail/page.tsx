import { Suspense } from "react";
import RecordDetailClient from "./RecordDetailClient";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
// 아이콘
import { Loader2 } from "lucide-react";

/** 이 페이지는 쿼리스트링에 의존하므로 정적 프리렌더 대신 동적 렌더링 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

function FallbackCard() {
  return (
    <Card className="m-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <CardTitle>불러오는 중…</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<FallbackCard />}>
      <RecordDetailClient />
    </Suspense>
  );
}
