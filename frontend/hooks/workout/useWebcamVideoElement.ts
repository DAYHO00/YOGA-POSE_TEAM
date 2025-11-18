import { useEffect } from "react";
import { toast } from "sonner";

export function useWebcamVideoElement(
  webcamVideoRef: React.RefObject<HTMLVideoElement | null>,
  webcamStream: MediaStream | null,
  isWebcamActive: boolean
) {
  useEffect(() => {
    if (!webcamStream || !isWebcamActive) {
      return;
    }

    let mounted = true;
    let retryTimeout: NodeJS.Timeout | null = null;

    const setupVideo = async (retry = 0) => {
      if (!mounted) return;

      const video = webcamVideoRef.current;

      if (!video) {
        if (retry < 10) {
          retryTimeout = setTimeout(() => setupVideo(retry + 1), 100);
        } else {
          console.error("웹캠 비디오 엘리먼트를 찾을 수 없습니다.");
        }
        return;
      }

      try {
        // 이전 스트림 정리
        if (video.srcObject && video.srcObject !== webcamStream) {
          const oldStream = video.srcObject as MediaStream;
          oldStream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }

        // 새 스트림 설정
        if (video.srcObject !== webcamStream) {
          video.srcObject = webcamStream;

          // 메타데이터 로드 대기
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(
              () => reject(new Error("Metadata timeout")),
              5000
            );
            video.onloadedmetadata = () => {
              clearTimeout(timeout);
              resolve();
            };
            video.onerror = () => {
              clearTimeout(timeout);
              reject(new Error("Video load error"));
            };
          });
        }

        // 재생
        if (video.paused) {
          await video.play();
        }
      } catch {
        if (retry < 10 && mounted) {
          retryTimeout = setTimeout(() => setupVideo(retry + 1), 300);
        } else {
          toast.error("웹캠 연결에 실패했습니다. 페이지를 새로고침해주세요.");
        }
      }
    };

    setupVideo();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);

      const video = webcamVideoRef.current;
      if (video) {
        video.pause();
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamStream, isWebcamActive, webcamVideoRef]);
}
