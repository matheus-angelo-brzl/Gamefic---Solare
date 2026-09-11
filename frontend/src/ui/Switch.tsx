import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface SwitchProps {
    value: boolean;
    onToggle: (value: boolean) => void;
    style?: CSSProperties;
}

export const Switch = ({ value, onToggle, style }: SwitchProps) => {
    return (
        <div
            onClick={() => onToggle(!value)}
            style={{
                width: '44px',
                height: '24px',
                borderRadius: tokens.borderRadius.chip,
                backgroundColor: value ? tokens.colors.yellow : tokens.colors.gray[200],
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 200ms ease',
                flexShrink: 0,
                ...style,
            }}
        >
            <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: tokens.colors.white,
                position: 'absolute',
                top: '3px',
                left: value ? '23px' : '3px',
                transition: 'left 200ms ease',
            }} />
        </div>
    );
};
