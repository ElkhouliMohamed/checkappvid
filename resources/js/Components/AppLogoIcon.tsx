import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
            <defs>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
                    <stop offset="100%" stopColor="#7C3AED" /> {/* Violet-600 */}
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Shield Body */}
            <path
                d="M50 95C50 95 85 80 85 45V15L50 5L15 15V45C15 80 50 95 50 95Z"
                fill="url(#shieldGradient)"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Inner Shield Accent (Glass effect hint) */}
            <path
                d="M50 12L78 20V45C78 72 50 86 50 86V12Z"
                fill="white"
                fillOpacity="0.1"
            />

            {/* Play Button */}
            <path
                d="M45 40L60 50L45 60V40Z"
                fill="white"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
            />

            {/* Checkmark overlay (Subtle, indicating 'Check') */}
            <path
                d="M35 50L45 65L75 35"
                stroke="#10B981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
            />
        </svg>
    );
}
