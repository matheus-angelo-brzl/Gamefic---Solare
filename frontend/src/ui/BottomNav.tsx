import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';
import { Session } from '../api';

export type NavTab = 'missoes' | 'rankings' | 'gestao' | 'perfil';

interface NavItem {
    key: NavTab;
    label: string;
    icon: React.ReactNode;
    roles?: string[];
}

const StarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const MedalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88M19 8C19 11.866 15.866 15 12 15C8.13401 15 5 11.866 5 8C5 4.13401 8.13401 1 12 1C15.866 1 19 4.13401 19 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const ClipboardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const NAV_ITEMS: NavItem[] = [
    { key: 'missoes',  label: 'Missões',  icon: <StarIcon /> },
    { key: 'rankings', label: 'Rankings', icon: <MedalIcon /> },
    { key: 'gestao',   label: 'Gestão',   icon: <ClipboardIcon />, roles: ['rh'] },
    { key: 'perfil',   label: 'Perfil',   icon: <UserIcon /> },
];

interface BottomNavProps {
    active: NavTab;
    onPress: (tab: NavTab) => void;
    style?: CSSProperties;
}

export const BottomNav = ({ active, onPress, style }: BottomNavProps) => {
    return (
        <nav style={{
            display: 'flex',
            flexDirection: 'row',
            height: '64px',
            backgroundColor: tokens.colors.white,
            borderTop: `1px solid ${tokens.colors.gray[200]}`,
            ...style,
        }}>
            {NAV_ITEMS.map(item => {
                const isVisible = !item.roles || item.roles.includes(Session.User.role);
                const isActive = item.key === active;
                return (
                    <button
                        key={item.key}
                        onClick={() => onPress(item.key)}
                        style={{
                            flex: 1,
                            display: isVisible ? 'flex' : 'none',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            borderTop: `2px solid ${isActive ? tokens.colors.yellow : 'transparent'}`,
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        <span style={{
                            fontSize: '20px',
                            color: isActive ? tokens.colors.yellow : tokens.colors.gray[100],
                        }}>
                            {item.icon}
                        </span>
                        <span style={{
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.subtitleComponent,
                            fontWeight: isActive ? tokens.typography.fontWeight.semibold : tokens.typography.fontWeight.regular,
                            color: isActive ? tokens.colors.yellow : tokens.colors.gray[100],
                        }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};