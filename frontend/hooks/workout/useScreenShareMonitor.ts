import { useEffect } from "react";
import { toast } from "sonner";

export function useScreenShareMonitor(
  isScreenShare: boolean,
  source: string | MediaStream | null,
  onScreenShareEnd: () => void
) {
  useEffect(() => {
    if (!isScreenShare || !source) return;

    const stream = source as MediaStream;
    const videoTrack = stream.getVideoTracks()[0];

    if (!videoTrack) {
      return;
    }

    const handleEnded = () => {
      toast.error("화면 공유가 종료되었습니다.");
      onScreenShareEnd();
    };

    videoTrack.addEventListener("ended", handleEnded);

    return () => {
      videoTrack.removeEventListener("ended", handleEnded);
    };
  }, [isScreenShare, source, onScreenShareEnd]);
}
