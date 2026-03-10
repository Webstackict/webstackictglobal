import React from 'react';
import Image from 'next/image';

export default function Logo({ className, height = 60, width = 220, variant = "white", ...props }) {
    const logoSrc = variant === "white" ? "/logo/webstack-logo-white.png" : "/logo/webstack-logo-dark.png";

    return (
        <div
            className={className}
            {...props}
            style={{
                position: 'relative',
                width: typeof width === 'number' ? `${width}px` : (width || 'auto'),
                height: typeof height === 'number' ? `${height}px` : (height || 'auto'),
                aspectRatio: '220 / 60',
                display: 'flex',
                alignItems: 'center',
                ...props.style
            }}
        >
            <Image
                src={logoSrc}
                alt="Webstack ICT Global Logo"
                fill
                priority
                sizes="500px"
                style={{
                    objectFit: 'contain',
                    objectPosition: 'left'
                }}
            />
        </div>
    );
}
