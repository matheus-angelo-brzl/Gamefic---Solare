  import React, { useState } from 'react';
import { tokens } from '../styles/tokens';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface CreateCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateCategoryModal = ({ visible, onClose, onSuccess }: CreateCategoryModalProps) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async () => {
        setError('');
        if (name.length < 5) return setError('O nome deve ter pelo menos 5 caracteres');
        if (name.length > 20) return setError('O nome não pode ter mais de 20 caracteres');

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error();
            showToast('Categoria criada com sucesso!', 'success');
            setName('');
            onSuccess?.();
            onClose();
        } catch {
            showToast('Erro ao criar categoria. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: toast.type === 'success' ? tokens.colors.success : tokens.colors.error,
                    color: tokens.colors.white,
                    padding: `${tokens.spacing.card} ${tokens.spacing.screen}`,
                    borderRadius: tokens.borderRadius.chip,
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: tokens.typography.fontSize.subtitleHeader,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    zIndex: 300,
                }}>
                    {toast.message}
                </div>
            )}
            <Modal visible={visible} title="Criar categoria" onClose={onClose}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.card, marginTop: tokens.spacing.card }}>
                    <Input
                        label="Nome"
                        value={name}
                        onChange={setName}
                        placeholder="Nome da categoria"
                        error={error}
                    />
                    <Button
                        label="Criar"
                        onPress={handleSubmit}
                        loading={loading}
                        style={{ width: '100%' }}
                    />
                </div>
            </Modal>
        </>
    );
};
