import React, { useState, CSSProperties } from 'react';
import { tokens } from '../styles/tokens';

interface InputProps {
    label?: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    inputHeight?: string;
    style?: CSSProperties;
    list?: string;
    multiline?: boolean;
    readOnly?: boolean;
    type?: string;
}

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 8C1 8 3.66667 3.33334 8 3.33334C12.3333 3.33334 15 8 15 8C15 8 12.3333 12.6667 8 12.6667C3.66667 12.6667 1 8 1 8Z" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9533 11.9533C10.846 12.4132 9.5313 12.6666 8 12.6666C3.66667 12.6666 1 8 1 8C1 8 2.05266 5.99266 3.86133 4.544M6.082 3.59333C6.702 3.42466 7.34067 3.33333 8 3.33333C12.3333 3.33333 15 8 15 8C15 8 14.288 9.356 12.8713 10.6013M1 1L15 15" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.414 9.414C9.03893 9.78907 8.54326 10 8 10C6.89543 10 6 9.10457 6 8C6 7.45674 6.21093 6.96107 6.586 6.586" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Input = ({
                          label,
                          value,
                          onChange,
                          placeholder,
                          secureTextEntry = false,
                          error,
                          inputHeight,
                          style,
                          list,
                          multiline = false,
                          readOnly = false,
                          type = 'text',
                      }: InputProps) => {
    const [hidden, setHidden] = useState(secureTextEntry);
    const defaultHeight = multiline ? '100px' : '40px';
    const finalHeight = inputHeight || defaultHeight;

    const inputType = secureTextEntry ? (hidden ? 'password' : 'text') : type;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

                <div style={{
                    display: 'flex',
                    alignItems: multiline ? 'flex-start' : 'center',
                    border: `1px solid ${error ? tokens.colors.error : tokens.colors.gray[200]}`,
                    borderRadius: tokens.borderRadius.card,
                    paddingInline: tokens.spacing.card,
                    paddingBlock: multiline ? tokens.spacing.card : '0',
                    height: finalHeight,
                    backgroundColor: tokens.colors.white,
                }}>
                    {multiline ? (
                        <textarea
                            value={value}
                            onChange={e => onChange && onChange(e.target.value)}
                            placeholder={placeholder}
                            readOnly={readOnly}
                            style={{
                                pointerEvents: readOnly ? 'none' : 'auto',
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontFamily: tokens.typography.fontFamily,
                                fontSize: tokens.typography.fontSize.subtitleHeader,
                                color: tokens.colors.black,
                                background: 'transparent',
                                resize: 'none',
                                minWidth: 0,
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    ) : (
                        <input
                            list={list}
                            type={inputType}
                            value={value}
                            onChange={e => onChange && onChange(e.target.value)}
                            placeholder={placeholder}
                            readOnly={readOnly}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontFamily: tokens.typography.fontFamily,
                                fontSize: tokens.typography.fontSize.subtitleHeader,
                                color: tokens.colors.black,
                                background: 'transparent',
                                minWidth: 0, // Fix para o ícone não estourar em telas pequenas
                            }}
                        />
                    )}
                    {secureTextEntry && !multiline && (
                        <button
                            type="button"
                            onClick={() => setHidden(prev => !prev)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: tokens.colors.gray[100],
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {hidden ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <span style={{
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: tokens.typography.fontSize.subtitleComponent,
                    color: tokens.colors.error,
                }}>
                    {error}
                </span>
            )}
        </div>
    );
};
