import React, { useState } from 'react';
import { tokens } from '../styles/tokens';
import { FormModal } from './FormModal';
import { UploadField } from './UploadField';
import { Notification } from './Notification';
import { api } from '../api';
import axios from 'axios';

interface ReviewSubmissionModalProps {
    visible: boolean;
    submission: any;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ReviewSubmissionModal = ({ visible, submission, onClose, onSuccess }: ReviewSubmissionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'error' });

    if (!submission) return null;

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleDownload = () => {
        const baseUrl = api.defaults.baseURL || '';
        const url = `${baseUrl}/submissions/attachment/${submission.attachmentKey}`;
        window.open(url, '_blank');
    };

    const handleResolve = async (status: 'approved' | 'rejected') => {
        try {
            setLoading(true);
            await api.patch(`/competition/evaluate`, { status, id: submission.id });
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Erro ao resolver submissão', error);
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.message) {
                    showNotification(data.message, 'error');
                } else {
                    showNotification('Falha ao resolver submissão', 'error');
                }
            } else {
                showNotification('Erro desconhecido ao resolver submissão', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ ...notification, message: '' })} 
            />
            <FormModal
                visible={visible}
                title="Resolver submissão"
                subtitle={submission.task.name}
                onClose={onClose}
            >
                <p style={{
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: tokens.typography.fontSize.titleComponent,
                    color: tokens.colors.black,
                    margin: 0,
                    lineHeight: tokens.typography.lineHeight.normal,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                }}>
                    {submission.task.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.text }}>
                    <UploadField 
                        label="Documento de comprovação" 
                        mode="download"
                        fileName={submission.fileName || 'Arquivo anexo'}
                        onDownload={handleDownload}
                    />
                </div>

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
                        border: `1px solid ${tokens.colors.gray[200]}`,
                        borderRadius: tokens.borderRadius.card,
                        paddingInline: tokens.spacing.card,
                        paddingBlock: tokens.spacing.card,
                    }}>
                        <textarea
                            value={submission.description}
                            readOnly
                            rows={4}
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: tokens.typography.fontFamily,
                                fontSize: tokens.typography.fontSize.titleComponent,
                                textAlign: 'justify',
                                color: tokens.colors.black,
                                background: 'transparent',
                                boxSizing: 'border-box',
                                overflowX: 'hidden',
                            }}
                        />
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '16px' 
                }}>
                    <button
                        onClick={() => handleResolve('rejected')}
                        disabled={loading}
                        style={{
                            flex: 1,
                            height: '38px',
                            backgroundColor: tokens.colors.white,
                            border: `1px solid ${tokens.colors.yellow}`,
                            borderRadius: tokens.borderRadius.card,
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.titleComponent,
                            fontWeight: tokens.typography.fontWeight.medium,
                            color: tokens.colors.yellow,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Indeferir
                    </button>
                    <button
                        onClick={() => handleResolve('approved')}
                        disabled={loading}
                        style={{
                            flex: 1,
                            height: '38px',
                            backgroundColor: tokens.colors.yellow,
                            border: 'none',
                            borderRadius: tokens.borderRadius.card,
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.titleComponent,
                            fontWeight: tokens.typography.fontWeight.medium,
                            color: tokens.colors.white,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Deferir
                    </button>
                </div>
            </FormModal>
        </>
    );
};
