import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface CardProps {
    children: React.ReactNode;
    style?: CSSProperties;
}

export const Card = ({ children, style }: CardProps) => {
    return (
        <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.card,
            border: `1px solid ${tokens.colors.gray[200]}`,
            padding: tokens.spacing.card,
            ...style,
        }}>
            {children}
        </div>
    );
};
