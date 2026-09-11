import React, { useEffect, useState } from 'react';
import { tokens } from '../styles/tokens';

interface NotificationProps {
    message: string;
    type?: 'error' | 'success';
    duration?: number;
    onClose?: () => void;
}

export const Notification = ({ message, type = 'error', duration = 2000, onClose }: NotificationProps) => {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [displayType, setDisplayType] = useState<'error' | 'success'>('error');

    useEffect(() => {
        if (message) {
            setDisplayMessage(message);
            setDisplayType(type);
            setMounted(true);

            // Pequeno delay para garantir que o elemento está no DOM antes de mudar a opacidade, forçando o fade-in
            const mountTimer = setTimeout(() => {
                setVisible(true);
            }, 10);

            const timer = setTimeout(() => {
                setVisible(false);
                // Espera a animação de fade-out (300ms) terminar antes de desmontar e limpar o estado
                setTimeout(() => {
                    setMounted(false);
                    setDisplayMessage('');
                    if (onClose) onClose();
                }, 300);
            }, duration);

            return () => {
                clearTimeout(mountTimer);
                clearTimeout(timer);
            };
        } else {
            // Quando a mensagem for limpa externamente (ex: múltiplos clicks no botão de login), 
            // fazemos o fade out preservando o texto original
            setVisible(false);
            const timer = setTimeout(() => {
                setMounted(false);
                setDisplayMessage('');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [message, type, duration, onClose]);

    if (!mounted && !displayMessage) return null;

    const isSuccess = displayType === 'success';
    const bgColor = isSuccess ? '#c4ff9fba' : '#ffaf9fba';
    const textColor = isSuccess ? tokens.colors.success : tokens.colors.error;

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            backgroundColor: bgColor,
            color: textColor,
            padding: '12px 24px',
            borderRadius: tokens.borderRadius.card,
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.fontSize.titleComponent,
            fontWeight: tokens.typography.fontWeight.medium,
            boxShadow: 'none',
            transition: 'opacity 0.3s ease-in-out',
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            zIndex: 1000,
        }}>
            {displayMessage}
        </div>
    );
};