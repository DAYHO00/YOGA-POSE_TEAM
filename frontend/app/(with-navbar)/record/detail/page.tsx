import { Suspense } from "react";
import RecordDetailClient from "./RecordDetailClient";

/** 이 페이지는 쿼리스트링에 의존하므로 정적 프리렌더 대신 동적 렌더링 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>불러오는 중…</div>}>
      <RecordDetailClient />
    </Suspense>
  );
}
