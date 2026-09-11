import React, { useState } from 'react';
import { tokens } from '../styles/tokens';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface CreateEditionModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateEditionModal = ({ visible, onClose, onSuccess }: CreateEditionModalProps) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rankingEndDate, setRankingEndDate] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (name.length < 3) newErrors.name = 'O nome deve ter pelo menos 3 caracteres';
        if (name.length > 32) newErrors.name = 'O nome não pode ter mais de 32 caracteres';
        if (!startDate) newErrors.startDate = 'Data de início obrigatória';
        if (!endDate) newErrors.endDate = 'Data de término obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/editions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    startDate,
                    endDate,
                    rankingEndDate: rankingEndDate || null,
                }),
            });

            if (!res.ok) throw new Error();
            showToast('Edição criada com sucesso!', 'success');
            setName(''); setStartDate(''); setEndDate(''); setRankingEndDate('');
            onSuccess?.();
            onClose();
        } catch {
            showToast('Erro ao criar edição. Tente novamente.', 'error');
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
            <Modal visible={visible} title="Criar edição" onClose={onClose}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.card, marginTop: tokens.spacing.card }}>
                    <Input label="Título" value={name} onChange={setName} placeholder="Ex: Edição Maio 2026" error={errors.name} />
                    <Input label="Data de Início" value={startDate} onChange={setStartDate} placeholder="DD/MM/AAAA" error={errors.startDate} />
                    <Input label="Data de Término" value={endDate} onChange={setEndDate} placeholder="DD/MM/AAAA" error={errors.endDate} />
                    <Input label="Ocultação do Ranking" value={rankingEndDate} onChange={setRankingEndDate} placeholder="DD/MM/AAAA (opcional)" />
                    <Button label="Criar" onPress={handleSubmit} loading={loading} style={{ width: '100%' }} />
                </div>
            </Modal>
        </>
    );
};
