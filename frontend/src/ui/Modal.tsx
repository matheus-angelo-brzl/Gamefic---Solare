import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface ModalProps {
    visible: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: React.ReactNode;
    style?: CSSProperties;
}

export const Modal = ({ visible, title, subtitle, onClose, children, style }: ModalProps) => {
    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: tokens.spacing.screen,
        }}>
            <div style={{
                backgroundColor: tokens.colors.white,
                borderRadius: tokens.borderRadius.window,
                padding: tokens.spacing.screen,
                width: '100%',
                maxWidth: '390px',
                ...style,
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: tokens.spacing.text,
                }}>
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.titleHeader,
                        fontWeight: tokens.typography.fontWeight.bold,
                        color: tokens.colors.black,
                    }}>
                        {title}
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: tokens.colors.black,
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>

                {subtitle && (
                    <span style={{
                        display: 'block',
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.titleComponent,
                        color: tokens.colors.gray[100],
                        marginBottom: tokens.spacing.card,
                    }}>
                        {subtitle}
                    </span>
                )}
                {children}
            </div>
        </div>
    );
};