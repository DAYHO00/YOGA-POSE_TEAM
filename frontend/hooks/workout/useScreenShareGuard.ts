import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useScreenShareGuard(isScreenShare: boolean) {
  const router = useRouter();
  const prevIsScreenShareRef = useRef(isScreenShare);

  useEffect(() => {
    if (prevIsScreenShareRef.current === true && isScreenShare === false) {
      router.back();
    }
    prevIsScreenShareRef.current = isScreenShare;
  }, [isScreenShare, router]);
}
