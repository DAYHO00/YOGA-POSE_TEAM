import { useEffect } from "react";
import { useWebcamStore } from "@/store";

export function useWebcamLifecycle(isReady: boolean) {
  const startWebcam = useWebcamStore((state) => state.startWebcam);
  const stopWebcam = useWebcamStore((state) => state.stopWebcam);
  const isWebcamActive = useWebcamStore((state) => state.isActive);

  useEffect(() => {
    // 모델이 완전히 로드된 후에만 웹캠 시작
    if (isReady) {
      startWebcam();
      return () => {
        stopWebcam();
      };
    }
  }, [isReady, startWebcam, stopWebcam]);

  return { isWebcamActive };
}
