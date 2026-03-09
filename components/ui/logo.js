import React from 'react';

export default function Logo({ className, ...props }) {
    return (
        <svg
            width="220"
            height="60"
            viewBox="0 0 220 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* High-Fidelity "W" Icon Recreation */}
            <path
                d="M20 45C17 45 15 43 14 41C12 37 15 30 18 25C21 20 25 12 20 8C19 7 18 7 17 8C12 11 15 18 18 23C21 28 25 35 23 40C22 43 20 44 18 44"
                fill="url(#blue_gradient)"
            />
            <path
                d="M32 45C29 45 27 43 26 41C24 37 27 30 30 25C33 20 37 12 32 8C31 7 30 7 29 8C24 11 27 18 30 23C33 28 37 35 35 40C34 43 32 44 30 44"
                fill="url(#blue_gradient)"
            />
            <path
                d="M48 44C44 44 41 40 40 36C39 30 42 22 44 15C46 8 48 3 53 5C54 6 54 7 54 8C53 13 50 20 48 26C46 32 44 39 46 42C47 43 48 44 50 44"
                fill="url(#blue_gradient)"
            />

            {/* Brand Typography */}
            <text
                x="65"
                y="32"
                fill="white"
                style={{
                    font: 'bold 32px "Inter", sans-serif',
                    letterSpacing: '-0.03em'
                }}
            >
                Webstack
            </text>
            <text
                x="72"
                y="50"
                fill="white"
                style={{
                    font: '500 12px "Inter", sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.45em'
                }}
            >
                ICT GLOBAL
            </text>

            <defs>
                <linearGradient
                    id="blue_gradient"
                    x1="20"
                    y1="5"
                    x2="50"
                    y2="45"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
            </defs>
        </svg>
    );
}
