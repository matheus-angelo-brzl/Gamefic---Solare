import React, { CSSProperties, useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';
import Trophy1 from '../assets/icons/Trophy1.svg?react';
import Trophy2 from '../assets/icons/Trophy2.svg?react';
import Trophy3 from '../assets/icons/Trophy3.svg?react';
import Medal from '../assets/icons/Medal.svg?react';
import Xp from '../assets/icons/Xp.svg?react';

interface RankingCardProps {
    id: string;
    name: string;
    role: string;
    xp: number;
    wins: number;
    position: number;
    isCurrentUser?: boolean;
    trend?: number;
    moved?: boolean;
    style?: CSSProperties;
}

export const RankingCard = ({
    name,
    xp,
    wins,
    position,
    isCurrentUser,
    moved = false,
    style,
}: RankingCardProps) => {
    const [isMoved, setIsMoved] = useState(false);

    // Quando a prop `moved` vier true (ou o xp mudar), ativamos a animação
    useEffect(() => {
        if (moved) {
            setIsMoved(false);
            // Pequeno delay para garantir que o React registre a remoção da classe e aplique novamente
            const timer = setTimeout(() => setIsMoved(true), 10);
            return () => clearTimeout(timer);
        }
    }, [moved, position, xp]);

    // Formatting numbers with dots (e.g. 2.730)
    const formattedXp = new Intl.NumberFormat('pt-BR').format(xp);

    // Style adjustments depending on position
    let backgroundColor = tokens.colors.white;
    let textColor = tokens.colors.gray[100];
    let highlightBg = "";
    
    if (isCurrentUser) {
        backgroundColor = 'rgba(217, 136, 54, 0.2)';
        textColor = tokens.colors.black;
        highlightBg = `linear-gradient(90deg, rgba(217, 136, 54, 0.2) 0%, rgba(217, 136, 54, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)`;
    }

    return (
        <div
            className={isMoved ? 'ranking-item--moved' : ''}
            onAnimationEnd={() => setIsMoved(false)}
            style={{
                backgroundColor: highlightBg ? undefined : backgroundColor,
                backgroundImage: highlightBg,
                borderRadius: '999px',
                border: `1px solid ${isCurrentUser ? 'rgba(217, 136, 54, 0.3)' : tokens.colors.gray[200]}`,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                height: '48px',
                width: '100%',
                boxSizing: 'border-box',
                ...style,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '30px',
                    flexShrink: 0,
                    position: 'relative'
                }}
            >
                {position === 1 && <Trophy1 />}
                {position === 2 && <Trophy2 />}
                {position === 3 && <Trophy3 />}
                {position > 3 && (
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: '16px',
                        color: isCurrentUser ? tokens.colors.black : tokens.colors.gray[100],
                        marginTop: '3px',
                        textAlign: 'center',
                        width: '32px'
                    }}>
                        {position}
                    </span>
                )}
            </div>

            <p
                style={{
                    flex: 1,
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: '14px',
                    color: isCurrentUser ? tokens.colors.black : tokens.colors.gray[100],
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {name}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ 
                        fontFamily: tokens.typography.fontFamily, 
                        fontSize: '12px', 
                        color: isCurrentUser ? tokens.colors.black : tokens.colors.gray[100] 
                    }}>
                        {wins}
                    </span>
                    <Medal />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ 
                        fontFamily: tokens.typography.fontFamily, 
                        fontSize: '12px', 
                        color: isCurrentUser ? tokens.colors.black : tokens.colors.gray[100] 
                    }}>
                        {formattedXp}
                    </span>
                    <Xp />
                </div>
            </div>
        </div>
    );
};
