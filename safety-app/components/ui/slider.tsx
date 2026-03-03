"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
    value?: number[];
    onValueChange?: (value: number[]) => void;
    max?: number;
    min?: number;
    step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {

        const singleValue = value ? value[0] : 0;
        const progressPercentage = ((singleValue - min) / (max - min)) * 100;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onValueChange) {
                onValueChange([parseFloat(e.target.value)]);
            }
        };

        return (
            <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
                {/* Track equivalent */}
                <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                    <div
                        className="absolute h-full bg-primary"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                {/* Thumb equivalent using input slider thumb via css, but since it's just input type range... */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={singleValue}
                    onChange={handleChange}
                    ref={ref}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    {...props}
                />
                <div
                    className="pointer-events-none absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background"
                    style={{ left: `calc(${progressPercentage}% - 10px)` }}
                />
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
