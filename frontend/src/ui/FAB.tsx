import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface FABProps {
    onPress: () => void;
    style?: CSSProperties;
}

export const FAB = ({ onPress, style }: FABProps) => {
    return (
        <button
            onClick={onPress}
            style={{
                width: '48px',
                height: '48px',
                borderRadius: tokens.borderRadius.chip,
                background: tokens.colors.yellow,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 0,
                right: 0,
                ...style,
            }}
        >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.83333 1V12.6667M1 6.83333H12.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    );
};
