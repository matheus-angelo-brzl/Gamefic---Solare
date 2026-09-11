import React, { useRef, CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface UploadFieldProps {
    label?: string;
    onChange?: (file: File | null) => void;
    file?: File | null;
    style?: CSSProperties;
    mode?: 'upload' | 'download';
    fileName?: string;
    onDownload?: () => void;
    accept?: string;
}

const defaultAccept = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
].join(',');

export const UploadField = ({ 
    label, 
    onChange, 
    file, 
    style, 
    mode = 'upload', 
    fileName, 
    onDownload,
    accept = defaultAccept,
}: UploadFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.files?.[0] ?? null);
        }
    };

    const handleClick = () => {
        if (mode === 'upload') {
            inputRef.current?.click();
        } else if (mode === 'download' && onDownload) {
            onDownload();
        }
    };

    const buttonText = mode === 'upload' ? 'Escolher arquivo' : 'Abrir Arquivo';
    const displayFileName = mode === 'upload' 
        ? (file ? file.name : 'Nenhum arquivo selecionado')
        : (fileName || 'Arquivo não encontrado');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.text, ...style }}>
            {label && (
                <span style={{
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: tokens.typography.fontSize.subtitleHeader,
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.gray[100],
                }}>
                    {label}
                </span>
            )}
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    width: '100%',
                    cursor: 'pointer',
                    height: '32px',
                }}
                onClick={handleClick}
            >
                {mode === 'upload' && (
                    <input
                        ref={inputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                        accept={accept}
                    />
                )}
                <div style={{
                    backgroundColor: tokens.colors.gray[200],
                    border: `1px solid ${tokens.colors.gray[200]}`,
                    borderTopLeftRadius: tokens.borderRadius.card,
                    borderBottomLeftRadius: tokens.borderRadius.card,
                    padding: '5px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.subtitleHeader,
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.gray[100],
                        lineHeight: 1.5,
                        whiteSpace: 'nowrap',
                    }}>
                        {buttonText}
                    </span>
                </div>
                <div style={{
                    flex: 1,
                    borderTop: `1px solid ${tokens.colors.gray[200]}`,
                    borderRight: `1px solid ${tokens.colors.gray[200]}`,
                    borderBottom: `1px solid ${tokens.colors.gray[200]}`,
                    borderTopRightRadius: tokens.borderRadius.card,
                    borderBottomRightRadius: tokens.borderRadius.card,
                    padding: '5px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                    backgroundColor: tokens.colors.white,
                }}>
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.subtitleHeader,
                        fontWeight: tokens.typography.fontWeight.regular,
                        color: tokens.colors.gray[100],
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {displayFileName}
                    </span>
                </div>
            </div>
        </div>
    );
};
