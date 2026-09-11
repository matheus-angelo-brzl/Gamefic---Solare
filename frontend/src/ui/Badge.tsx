import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface BadgeProps {
    xp: number;
    style?: CSSProperties;
}

export const Badge = ({ xp, style }: BadgeProps) => {
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: tokens.borderRadius.chip,
            backgroundColor: tokens.colors.yellow50,
            paddingInline: tokens.spacing.chip,
            paddingBlock: '3px',
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.fontSize.subtitleComponent,
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.yellow,
            ...style,
        }}>
            +{xp} XP
        </span>
    );
};
