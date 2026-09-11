import React, { useState, useEffect } from 'react';
import { FormModal } from './FormModal';
import { Input } from './Input';
import { Button } from './Button';
import { Notification } from './Notification';
import { api } from '../api';
import axios from 'axios';

interface Edition {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    rankingEndDate: string | null;
}

interface EditionModalProps {
    visible: boolean;
    edition: Edition | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditionModal = ({ visible, edition, onClose, onSuccess }: EditionModalProps) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rankingEndDate, setRankingEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'error' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = !!edition;

    // Helper to format ISO date to YYYY-MM-DD for input type="date"
    const formatDateForInput = (isoString?: string | null) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    };

    // Helper to append time to date string so backend gets a valid ISO format
    const formatInputToISO = (dateString: string) => {
        if (!dateString) return null;
        return new Date(`${dateString}T00:00:00`).toISOString();
    };

    useEffect(() => {
        if (visible) {
            setNotification({ message: '', type: 'error' });
            setErrors({});
            if (edition) {
                setName(edition.name);
                setStartDate(formatDateForInput(edition.startDate));
                setEndDate(formatDateForInput(edition.endDate));
                setRankingEndDate(formatDateForInput(edition.rankingEndDate));
            } else {
                setName('');
                setStartDate('');
                setEndDate('');
                setRankingEndDate('');
            }
        }
    }, [visible, edition]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const payload = {
            name,
            startDate: formatInputToISO(startDate),
            endDate: formatInputToISO(endDate),
            rankingEndDate: rankingEndDate ? formatInputToISO(rankingEndDate) : null,
        };

        try {
            if (isEdit && edition) {
                await api.patch(`/editions/${edition.id}`, payload);
                showNotification('Edição atualizada com sucesso!', 'success');
            } else {
                await api.post('/editions', payload);
                showNotification('Edição criada com sucesso!', 'success');
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors && Array.isArray(data.errors)) {
                    const newErrors: Record<string, string> = {};
                    data.errors.forEach((err: any) => {
                        if (err.path && err.path.length > 0) {
                            newErrors[err.path[0]] = err.message.replace(/\.$/, "");
                        }
                    });
                    setErrors(newErrors);
                } else if (data.message) {
                    showNotification(data.message, 'error');
                } else {
                    showNotification(isEdit ? 'Erro ao atualizar edição.' : 'Erro ao criar edição.', 'error');
                }
            } else {
                showNotification('Erro desconhecido. Tente novamente.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: 'error' })} />
            <FormModal
                visible={visible}
                title={isEdit ? "Editar edição" : "Criar edição"}
                onClose={onClose}
                footer={
                    <Button 
                        label={isEdit ? "Atualizar" : "Criar"} 
                        onPress={handleSubmit} 
                        loading={loading} 
                        style={{ width: '100%' }} 
                    />
                }
            >
                <Input
                    label="Título"
                    value={name}
                    onChange={setName}
                    placeholder="Ex: Edição Maio 2026"
                    error={errors.name}
                />
                <Input
                    label="Data de Início"
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="YYYY-MM-DD"
                    error={errors.startDate}
                    type="date"
                />
                <Input
                    label="Data de Término"
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="YYYY-MM-DD"
                    error={errors.endDate}
                    type="date"
                />
                <Input
                    label="Data de Ocultação do Ranking"
                    value={rankingEndDate}
                    onChange={setRankingEndDate}
                    placeholder="YYYY-MM-DD (Opcional)"
                    error={errors.rankingEndDate}
                    type="date"
                />
            </FormModal>
        </>
    );
};
