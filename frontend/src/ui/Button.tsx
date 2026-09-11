import React, { useState } from 'react';
import { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    style?: CSSProperties;
}

export const Button = ({
                           label,
                           onPress,
                           variant = 'primary',
                           loading = false,
                           disabled = false,
                           style,
                       }: ButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPrimary = variant === 'primary';

    return (
        <button
            onClick={onPress}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled || loading}
            style={{
                height: '48px',
                borderRadius: tokens.borderRadius.card,
                border: 'none',
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled || loading ? 0.5 : 1,
                paddingInline: tokens.spacing.screen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isPrimary 
                    ? (isHovered ? '#bd732e' : tokens.colors.yellow) 
                    : (isHovered ? tokens.colors.gray[300] : 'transparent'),
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.fontSize.titleComponent,
                fontWeight: tokens.typography.fontWeight.semibold,
                color: isPrimary ? tokens.colors.white : tokens.colors.yellow,
                transition: 'background-color 200ms ease, opacity 150ms ease',
                ...style,
            }}
        >
            {loading ? (
                <span style={{
                    width: '16px',
                    height: '16px',
                    border: `2px solid ${tokens.colors.white}`,
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }} />
            ) : label}
        </button>
    );
};
