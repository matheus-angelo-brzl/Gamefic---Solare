import React from 'react';
import { tokens } from '../styles/tokens';
import Logo from '../assets/logo.svg';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
    return (
        <div style={{ 
            padding: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '20px', 
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.black 
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{ 
                        margin: 0, 
                        fontSize: '12px', 
                        color: tokens.colors.gray[100] 
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
            <img src={Logo} alt="Solare" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
        </div>
    );
};
