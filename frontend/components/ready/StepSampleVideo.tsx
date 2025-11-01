"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SAMPLE_VIDEOS = [
  {
    title: "Morning Yoga Flow",
    path: "/videos/test_h264.m4v",
    thumbPath:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    duration: "15분",
  },
  {
    title: "Full Body HIIT Workout",
    path: "/videos/test_h264.m42",
    thumbPath:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    duration: "20분",
  },
  {
    title: "Core Strength Training",
    path: "/videos/test_h264.m43",
    thumbPath:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    duration: "12분",
  },
];

interface StepSampleVideoProps {
  onComplete: (video: { title: string; path: string } | null) => void;
  selectedVideo: { title: string; path: string } | null;
}

export default function StepSampleVideo({
  onComplete,
  selectedVideo,
}: StepSampleVideoProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    const video = SAMPLE_VIDEOS[index];
    onComplete({ title: video.title, path: video.path });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center justify-center w-full mx-auto'
    >
      <h2 className='mb-4 text-3xl font-bold text-gray-800'>
        샘플 영상 선택하기
      </h2>
      <p className='mb-8 text-gray-600'>
        <span className='text-[#3A6BFC] font-semibold'>Samadhi</span>가 추천하는
        운동을 만나보세요
      </p>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {SAMPLE_VIDEOS.map((video, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCardClick(index)}
            className={`group cursor-pointer p-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${
              selectedIndex === index
                ? "border-2 border-[#3A6BFC] bg-white"
                : "border border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className='relative mb-3 overflow-hidden rounded-lg h-48'>
              <img
                className='object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105'
                src={video.thumbPath}
                alt={video.title}
              />
              <div className='absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-black/70 rounded'>
                {video.duration}
              </div>
            </div>

            <div className='flex flex-col'>
              <p className='mb-3 text-lg font-semibold leading-tight text-gray-800 line-clamp-2'>
                {video.title}
              </p>

              <Button
                variant={selectedIndex === index ? "primary" : "outline"}
                className='w-full h-9 text-sm'
              >
                {selectedIndex === index ? "✓ 선택됨" : "선택하기"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
