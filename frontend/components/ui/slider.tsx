// src/components/ui/slider.tsx
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>;

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, value, defaultValue, ...props }, ref) => {
  // value/defaultValue 배열 길이에 맞춰 Thumb 개수 결정
  const thumbCount =
    (Array.isArray(value) && value.length) ||
    (Array.isArray(defaultValue) && defaultValue.length) ||
    1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value as number[] | undefined}
      defaultValue={defaultValue as number[] | undefined}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      {/* 선(트랙) */}
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#e6f0ff]">
        {/* 채워진 구간 */}
        <SliderPrimitive.Range className="absolute h-full bg-[#2563eb]" />
      </SliderPrimitive.Track>

      {/* 원(썸)들 */}
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          // key는 필수
          key={i}
          className="block h-5 w-5 rounded-full border-2 border-[#2563eb] bg-white
                     shadow transition-colors
                     ring-offset-background focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2
                     disabled:pointer-events-none disabled:opacity-50"
          aria-label={
            thumbCount > 1 ? (i === 0 ? "Minimum" : "Maximum") : "Value"
          }
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = "Slider";

export { Slider };
