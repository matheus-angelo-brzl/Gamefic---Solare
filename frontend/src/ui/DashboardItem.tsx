import React, { CSSProperties, ReactNode } from 'react';
import { tokens } from '../styles/tokens';

interface DashboardItemProps {
  icon: ReactNode | string;
  label: string;
  value: string | number;
  style?: CSSProperties;
}

export const DashboardItem = ({ icon, label, value, style }: DashboardItemProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing.card,
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.card,
        border: `1px solid ${tokens.colors.gray[200]}`,
        padding: tokens.spacing.card,
        flex: 1,
        ...style,
      }}
    >
      {/* NOVO: Fundo arredondado suave para o ícone (como na imagem) */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: tokens.colors.yellow50, // Laranja translúcido
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.colors.yellow,
          flexShrink: 0,
        }}
      >
        {typeof icon === 'string' ? <span style={{ fontSize: '20px' }}>{icon}</span> : icon}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.fontSize.subtitleComponent,
            fontWeight: tokens.typography.fontWeight.regular,
            color: tokens.colors.gray[100],
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.fontSize.titleHeader, // Letra um pouco maior
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.black,
            lineHeight: '1.2',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};
