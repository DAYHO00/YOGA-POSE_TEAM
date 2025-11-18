import { useEffect } from "react";

export function useVideoCleanup(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, [videoRef]);
}
