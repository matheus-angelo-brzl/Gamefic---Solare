import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';
import { Badge } from './Badge';
import { Chip } from './Chip';

interface BaseCardProps {
    title: string;
    xp: number;
    category: string;
    subtitleNode?: React.ReactNode;
    actionNode?: React.ReactNode;
    onClick?: () => void;
    style?: CSSProperties;
}

export const BaseCard = ({ title, xp, category, subtitleNode, actionNode, onClick, style }: BaseCardProps) => {
    return (
        <div 
            onClick={onClick}
            style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.card,
            border: `1px solid ${tokens.colors.gray[200]}`,
            borderLeft: `4px solid ${tokens.colors.yellow}`,
            padding: tokens.spacing.card,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            cursor: onClick ? 'pointer' : 'default',
            ...style,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.titleComponent,
                        fontWeight: tokens.typography.fontWeight.semibold,
                        color: tokens.colors.black,
                        margin: 0,
                    }}>
                        {title}
                    </p>
                    {subtitleNode && (
                        <div style={{
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.subtitleComponent,
                            color: tokens.colors.gray[100],
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            {subtitleNode}
                        </div>
                    )}
                </div>
                <Badge xp={xp} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <Chip label={category} selected style={{ backgroundColor: tokens.colors.yellow20 }} />
                {actionNode}
            </div>
        </div>
    );
};

interface TaskCardProps {
    title: string;
    xp: number;
    submissions: number | null;
    category: string;
    onEdit?: () => void;
    onClick?: () => void;
    style?: CSSProperties;
}

export const TaskCard = ({ title, xp, submissions, category, onEdit, onClick, style }: TaskCardProps) => {
    return (
        <BaseCard
            title={title}
            xp={xp}
            category={category}
            onClick={onClick}
            style={style}
            subtitleNode={
                submissions !== null 
                    ? <>{submissions} {submissions === 1 ? 'submissão restante' : 'submissões restantes'}</> 
                    : null
            }
            actionNode={
                onEdit ? (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.16669 3.33333H3.33335C2.89133 3.33333 2.4674 3.50893 2.15484 3.82149C1.84228 4.13405 1.66669 4.55797 1.66669 5V16.6667C1.66669 17.1087 1.84228 17.5326 2.15484 17.8452C2.4674 18.1577 2.89133 18.3333 3.33335 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V10.8333M15.4167 2.08333C15.7482 1.75181 16.1978 1.56557 16.6667 1.56557C17.1355 1.56557 17.5852 1.75181 17.9167 2.08333C18.2482 2.41485 18.4345 2.86449 18.4345 3.33333C18.4345 3.80217 18.2482 4.25181 17.9167 4.58333L10 12.5L6.66669 13.3333L7.50002 10L15.4167 2.08333Z" stroke="#D5D5D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                ) : null
            }
        />
    );
};

interface SubmissionCardProps {
    title: string;
    xp: number;
    category: string;
    author: string;
    date: string;
    onClick?: () => void;
    style?: CSSProperties;
}

export const SubmissionCard = ({ title, xp, category, author, date, onClick, style }: SubmissionCardProps) => {
    return (
        <BaseCard
            title={title}
            xp={xp}
            category={category}
            onClick={onClick}
            style={style}
            subtitleNode={
                <>
                    <span>{author}</span>
                    <span>&bull;</span>
                    <span>{date}</span>
                </>
            }
        />
    );
};

interface MemberSubmissionCardProps {
    title: string;
    xp: number;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    onClick?: () => void;
    style?: CSSProperties;
}

export const MemberSubmissionCard = ({ title, xp, category, status, date, onClick, style }: MemberSubmissionCardProps) => {
    const getStatusConfig = (s: string) => {
        switch (s) {
            case 'approved': return { label: 'Deferido', color: tokens.colors.success };
            case 'rejected': return { label: 'Indeferido', color: tokens.colors.error };
            default: return { label: 'Pendente', color: tokens.colors.yellow };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <BaseCard
            title={title}
            xp={xp}
            category={category}
            onClick={onClick}
            style={style}
            subtitleNode={
                <>
                    <span style={{ color: statusConfig.color, fontWeight: tokens.typography.fontWeight.medium }}>
                        {statusConfig.label}
                    </span>
                    <span>&bull;</span>
                    <span>{date}</span>
                </>
            }
        />
    );
};
