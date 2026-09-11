import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface ChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    style?: CSSProperties;
}

export const ChipCategory = ({ label, selected = false, onPress, style }: ChipProps) => {
    return (
        <span
            onClick={onPress}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: tokens.borderRadius.chip,
                border: `1px solid ${selected ? tokens.colors.yellow : tokens.colors.gray[200]}`,
                backgroundColor: selected ? tokens.colors.yellow : tokens.colors.gray[200],
                paddingInline: tokens.spacing.chip,
                paddingBlock: '3px',
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.fontSize.subtitleComponent,
                color: selected ? tokens.colors.white : tokens.colors.gray[100],
                cursor: onPress ? 'pointer' : 'default',
                userSelect: 'none',
                transition: 'all 150ms ease',
                ...style,
            }}
        >
            {label}
        </span>
    );
};