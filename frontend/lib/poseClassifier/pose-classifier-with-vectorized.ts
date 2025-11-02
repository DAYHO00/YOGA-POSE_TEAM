import { poseVectorizedData } from "@/types/poseVectorizedData";
import { CalculateSimilarity, LANDMARK_INDICES } from "../mediapipe/angle-calculator";
import { JointAngles } from "@/types/pose";
import { poseData } from "@/types/poseData";

export function classifyPoseWithVectorized(vectorized: number[], angles?: JointAngles) {
    let bestPose = "unknown";
    let maxDistance = 0;
    const distPerPose: Record<string, number[]> = {};
    const VEC_THRESHOLD = 88;
    const ANGLE_THRESHOLD = 96;

    // 좌우 반전 버전 생성
    const mirroredVectorized = normalizeMirroredVectorized(vectorized);
    const mirroredAngles = angles ? normalizeMirroredAngles(angles) : angles;

    for (const [name, poseVectorized] of Object.entries(poseVectorizedData)) {
        const poseAngles = poseData[name as keyof typeof poseData];
      const calcVecDistance = (a: number[]) => {
        const similarity = CalculateSimilarity(poseVectorized, a, 1);
        
        // 100에 가까울 수록 유사, 0에 가까울수록 다름
        return similarity;
      };
      
      const calcDistance = (a: JointAngles) => {
        const keys = Object.keys(a) as (keyof JointAngles)[];
        
        // dot product, magnitude of a and poseAngles
        const { dot, magA, magB } = keys.reduce(
          (acc, key) => {
            const valA = a[key];
            const valB = poseAngles[key];
            acc.dot += valA * valB;
            acc.magA += valA * valA;
            acc.magB += valB * valB;
            return acc;
          },
          { dot: 0, magA: 0, magB: 0 }
        );

        const similarity = dot / (Math.sqrt(magA) * Math.sqrt(magB));
        
        // 100에 가까울 수록 유사, 0에 가까울수록 다름
        return similarity * 100;
      };

      // 원본과 반전 둘 다 계산
      const distanceOriginal = calcVecDistance(vectorized);
      const distanceMirrored = calcVecDistance(mirroredVectorized);
      
      const angleDistanceOriginal = angles && poseAngles ? calcDistance(angles) : 0;
        const angleDistanceMirrored = mirroredAngles && poseAngles ? calcDistance(mirroredAngles) : 0;

      // 더 유사한 쪽 선택
      const maxForThisPose = distanceOriginal > distanceMirrored ? distanceOriginal : distanceMirrored;
      const _angleMaxForThisPose = distanceOriginal > distanceMirrored ? angleDistanceOriginal : angleDistanceMirrored;
      const angleMaxForThisPose = angles ? _angleMaxForThisPose : ANGLE_THRESHOLD + 1; // 각도 데이터가 없으면 각도 조건 무시
      
      if (maxForThisPose > VEC_THRESHOLD && angleMaxForThisPose > ANGLE_THRESHOLD && maxForThisPose > maxDistance) {
        maxDistance = maxForThisPose + angleMaxForThisPose;
        bestPose = name;
      }
      
      distPerPose[name] = [maxForThisPose, angleMaxForThisPose];
    }
    
    console.log("distPerPose:", distPerPose);
    console.log("Max Distance:", maxDistance)
    console.log("Best Pose:", bestPose)

    return {bestPose, maxDistance};
  };
  
// 좌우 반전된 각도 데이터 생성 함수
export const normalizeMirroredVectorized = (vectorized: number[]): number[] => {
    const swapped: number[] = [ ...vectorized ];

    // 좌우 대칭 쌍 정의
    const mirrorPairs = [
        [LANDMARK_INDICES.LEFT_EAR, LANDMARK_INDICES.RIGHT_EAR],
        [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_SHOULDER],
        [LANDMARK_INDICES.LEFT_ELBOW, LANDMARK_INDICES.RIGHT_ELBOW],
        [LANDMARK_INDICES.LEFT_WRIST, LANDMARK_INDICES.RIGHT_WRIST],
        [LANDMARK_INDICES.LEFT_INDEX, LANDMARK_INDICES.RIGHT_INDEX],
        [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.RIGHT_HIP],
        [LANDMARK_INDICES.LEFT_KNEE, LANDMARK_INDICES.RIGHT_KNEE],
        [LANDMARK_INDICES.LEFT_ANKLE, LANDMARK_INDICES.RIGHT_ANKLE],
        [LANDMARK_INDICES.LEFT_HEEL, LANDMARK_INDICES.RIGHT_HEEL],
    ];
    
    // 각 쌍의 값을 교환
    mirrorPairs.forEach(([left, right]) => {
      const temp = swapped[left];
      swapped[left] = swapped[right];
      swapped[right] = temp;
    });

    // spine, neckAngle은 중앙 기준이므로 그대로 유지
    return swapped as number[];
};

// 좌우 반전된 각도 데이터 생성 함수
export const normalizeMirroredAngles = (angles: JointAngles): JointAngles => {
    const swapped: Partial<JointAngles> = { ...angles };

    // 좌우 대칭 쌍 정의
    const mirrorPairs = [
      ["leftShoulder", "rightShoulder"],
      ["leftElbow", "rightElbow"],
      ["leftWrist", "rightWrist"],
      ["leftHip", "rightHip"],
      ["leftKnee", "rightKnee"],
      ["leftAnkle", "rightAnkle"],
      ["leftHipShoulderAlign", "rightHipShoulderAlign"],
    ];

    // 각 쌍의 값을 교환
    mirrorPairs.forEach(([left, right]) => {
      const temp = swapped[left as keyof JointAngles];
      swapped[left as keyof JointAngles] = swapped[right as keyof JointAngles];
      swapped[right as keyof JointAngles] = temp;
    });

    // spine, neckAngle은 중앙 기준이므로 그대로 유지
    return swapped as JointAngles;
};