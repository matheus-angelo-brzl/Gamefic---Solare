import React, { CSSProperties, useState } from 'react';
import { tokens } from '../styles/tokens';

interface SegmentedControlOption {
    key: string;
    label: string;
}

interface SegmentedControlProps {
    options: SegmentedControlOption[];
    activeKey: string;
    onSelect: (key: string) => void;
    style?: CSSProperties;
}

export const SegmentedControl = ({ options, activeKey, onSelect, style }: SegmentedControlProps) => {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    return (
        <div
            style={{
                display: 'flex',
                backgroundColor: tokens.colors.white, // Fundo branco
                borderRadius: '9999px', // Totalmente arredondado (pill shape)
                border: '1px solid #9B8EC4', // Borda roxa/lilás
                padding: '6px', // Padding interno
                width: '400px', // Largura fixa
                height: '52px', // Altura fixa
                alignItems: 'center', // Centraliza verticalmente
                justifyContent: 'space-around', // Distribui o espaço
                overflow: 'hidden',
                boxSizing: 'border-box', // Garante que padding e border não aumentem o tamanho total
                ...style,
            }}
        >
            {options.map((option) => (
                <button
                    key={option.key}
                    onClick={() => onSelect(option.key)}
                    onMouseEnter={() => setHoveredKey(option.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                    style={{
                        flex: 1, // Todas as opções com a mesma largura
                        height: '100%', // Preenche a altura vertical
                        padding: '0 16px', // Padding horizontal
                        border: 'none',
                        borderRadius: '9999px', // Pill shape para o botão
                        background:
                            option.key === activeKey
                                ? '#E8973A' // Laranja/âmbar se ativo
                                : hoveredKey === option.key
                                ? tokens.colors.gray[200] // Cinza claro se hover e não ativo
                                : 'transparent', // Transparente caso contrário
                        color: option.key === activeKey ? tokens.colors.white : tokens.colors.black, // Texto branco ou preto
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: '16px', // Tamanho da fonte
                        fontWeight: tokens.typography.fontWeight.medium, // Peso médio
                        cursor: 'pointer',
                        transition: 'all 0.25s ease', // Transição suave
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap', // Evita que o texto quebre
                    }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
