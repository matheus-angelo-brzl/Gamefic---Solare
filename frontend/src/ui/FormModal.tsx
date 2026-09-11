import React, { ReactNode } from 'react';
import { tokens } from '../styles/tokens';
import { Modal } from './Modal';

interface FormModalProps {
    visible: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}

export const FormModal = ({
    visible,
    title,
    subtitle,
    onClose,
    children,
    footer
}: FormModalProps) => {
    return (
        <Modal visible={visible} title={title} subtitle={subtitle} onClose={onClose}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.card, marginTop: tokens.spacing.card }}>
                {children}
            </div>
            {footer && (
                <div style={{ marginTop: tokens.spacing.card }}>
                    {footer}
                </div>
            )}
        </Modal>
    );
};
