import { useVideoStore } from "@/store";

export function useVideoControls(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const { setCurrentTime } = useVideoStore();

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    void (video.paused ? video.play() : video.pause());
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  return {
    handleTogglePlay,
    handleSeek,
  };
}
