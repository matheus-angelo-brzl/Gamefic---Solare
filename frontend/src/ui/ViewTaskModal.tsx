import React, { useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { FormModal } from './FormModal';
import { UploadField } from './UploadField';
import { Button } from './Button';
import { Notification } from './Notification';
import { api } from '../api';
import axios from 'axios';

interface Task {
    id: string;
    name: string;
    description: string;
}

interface ViewTaskModalProps {
    visible: boolean;
    task: Task | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ViewTaskModal = ({ visible, task, onClose, onSuccess }: ViewTaskModalProps) => {
    const [justificativa, setJustificativa] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'error' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (visible) {
            setJustificativa('');
            setFile(null);
            setErrors({});
            setNotification({ message: '', type: 'error' });
        }
    }, [visible]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleSubmit = async () => {
        if (loading || !task) return;

        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('taskId', task.id);
            formData.append('description', justificativa);
            if (file) {
                formData.append('file', file);
            }

            await api.post('/submissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showNotification('Missão submetida com sucesso!', 'success');
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors && Array.isArray(data.errors)) {
                    const newErrors: Record<string, string> = {};
                    data.errors.forEach((err: any) => {
                        if (err.path && err.path.length > 0) {
                            const path = err.path[0] === 'description' ? 'justificativa' : err.path[0];
                            newErrors[path] = err.message.replace(/\.$/, "");
                        }
                    });
                    setErrors(newErrors);
                } else if (data.message) {
                    showNotification(data.message, 'error');
                } else {
                    showNotification('Erro ao submeter missão.', 'error');
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
                title="Submeter missão"
                subtitle={task?.name || ''}
                onClose={onClose}
                footer={
                    <Button label="Submeter" onPress={handleSubmit} loading={loading} style={{ width: '100%' }} />
                }
            >
                {/* Description */}
                <p style={{
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: tokens.typography.fontSize.titleComponent,
                    color: tokens.colors.black,
                    overflowWrap: 'break-word',
                    textAlign: 'justify',
                    margin: 0,
                    lineHeight: 1.5,
                }}>
                    {task?.description || ''}
                </p>

                {/* File Upload */}
                <UploadField 
                    label="Anexar documento de comprovação" 
                    file={file} 
                    onChange={setFile} 
                />

                {/* Justificativa */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.text }}>
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.subtitleHeader,
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.gray[100],
                    }}>
                        Justificativa
                    </span>
                    <div style={{
                        border: `1px solid ${errors.justificativa ? tokens.colors.error : tokens.colors.gray[200]}`,
                        borderRadius: tokens.borderRadius.card,
                        paddingInline: tokens.spacing.card,
                        paddingBlock: tokens.spacing.card,
                        backgroundColor: tokens.colors.white,
                    }}>
                        <textarea
                            value={justificativa}
                            onChange={e => setJustificativa(e.target.value)}
                            rows={4}
                            placeholder="Escreva aqui..."
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: tokens.typography.fontFamily,
                                fontSize: tokens.typography.fontSize.titleComponent,
                                color: tokens.colors.black,
                                background: 'transparent',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    {errors.justificativa && (
                        <span style={{
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.subtitleComponent,
                            color: tokens.colors.error,
                        }}>
                            {errors.justificativa}
                        </span>
                    )}
                </div>
            </FormModal>
        </>
    );
};
