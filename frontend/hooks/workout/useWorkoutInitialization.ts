import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useWorkoutInitialization(
  source: string | MediaStream | null,
  isInitialized: boolean
) {
  const router = useRouter();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // 새로고침 감지 및 리다이렉트
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timeoutId = setTimeout(() => {
      if (!source) {
        router.push("/ready");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // source와 모델 초기화 완료 체크
  useEffect(() => {
    if (source && isInitialized) {
      setIsSetupComplete(true);
    }
  }, [source, isInitialized]);

  return { isSetupComplete };
}
