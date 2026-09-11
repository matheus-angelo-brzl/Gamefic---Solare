import React from 'react';
import { tokens } from '../styles/tokens';
import { FormModal } from './FormModal';
import { UploadField } from './UploadField';
import { api } from '../api';

interface ViewSubmissionModalProps {
    visible: boolean;
    submission: any;
    onClose: () => void;
}

export const ViewSubmissionModal = ({ visible, submission, onClose }: ViewSubmissionModalProps) => {
    if (!submission) return null;

    const handleDownload = () => {
        const baseUrl = api.defaults.baseURL || '';
        const url = `${baseUrl}/submissions/attachment/${submission.attachmentKey}`;
        window.open(url, '_blank');
    };

    return (
        <FormModal
            visible={visible}
            title="Visualizar submissão"
            subtitle={submission.task?.name || ''}
            onClose={onClose}
        >
            <p style={{
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.fontSize.titleComponent,
                color: tokens.colors.black,
                overflowWrap: 'break-word',
                textAlign: 'justify',
                margin: 0,
                lineHeight: 1.5,
            }}>
                {submission.task?.description || ''}
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
                    backgroundColor: tokens.colors.white,
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
                            color: tokens.colors.black,
                            background: 'transparent',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            </div>
        </FormModal>
    );
};
