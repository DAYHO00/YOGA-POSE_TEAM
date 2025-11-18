import { useEffect } from "react";
import { useVideoStore } from "@/store";

export function useVideoSync(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  sourceType: string,
  isReady: boolean
) {
  const { setPlaying, setCurrentTime, setDuration } = useVideoStore();

  useEffect(() => {
    const video = videoRef?.current;
    if (!video || sourceType !== "url" || !isReady) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);

    setPlaying(!video.paused);
    if (video.duration) setDuration(video.duration);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
    };
  }, [sourceType, isReady, setPlaying, setCurrentTime, setDuration, videoRef]);
}
