import React, { useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';
import { Header } from '../../ui/Header';
import { DashCard, DashIcons } from '../../ui/DashCard';
import { TaskCard, SubmissionCard } from '../../ui/TaskCard';
import { ReviewSubmissionModal } from '../../ui/ReviewSubmissionModal';
import { EditionModal } from '../../ui/EditionModal';
import { api } from '../../api';

interface Edition {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    rankingEndDate: string | null;
}

interface Metrics {
    missionsCompleted: number;
    editionTotalXp: number;
    totalXpDistributed: number;
    submissions: {
        received: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    remainingDays: number;
}

export default function Gestao() {
    const [editions, setEditions] = useState<Edition[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [activeEditionIndex, setActiveEditionIndex] = useState<number | null>(null);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewingSubmission, setReviewingSubmission] = useState<any | null>(null);
    const [editionModalOpen, setEditionModalOpen] = useState(false);

    // currentIndex = -1 significa ir para o futuro (1 clique após a edição mais recente)
    // currentIndex = 0 é a edição mais recente retornada pela API
    const selectedEdition = currentIndex >= 0 && currentIndex < editions.length ? editions[currentIndex] : null;

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            
            // 1. Busca edições
            const editionsRes = await api.get('/editions');
            const fetchedEditions = editionsRes.data;
            setEditions(fetchedEditions);

            const now = new Date();
            const idx = fetchedEditions.findIndex((e: Edition) => {
                const start = new Date(e.startDate);
                const end = new Date(e.endDate);
                return now >= start && now <= end;
            });
            
            setActiveEditionIndex(idx !== -1 ? idx : null);
            const finalIndex = idx !== -1 ? idx : 0;
            setCurrentIndex(finalIndex);

            // 2. Busca submissões pendentes se houver uma edição ativa
            if (idx !== -1) {
                try {
                    const pendingRes = await api.get('/submissions/pending');
                    setPendingSubmissions(pendingRes.data);
                } catch (pendingErr) {
                    console.error('Nenhuma edição ativa ou erro ao buscar pendentes:', pendingErr);
                    setPendingSubmissions([]);
                }
            } else {
                setPendingSubmissions([]);
            }

            // 3. Busca métricas da edição inicial
            if (fetchedEditions.length > 0 && finalIndex >= 0) {
                await fetchMetrics(fetchedEditions[finalIndex].id);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de gestão', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetrics = async (editionId: string) => {
        try {
            const res = await api.get(`/metrics/editions/${editionId}`);
            setMetrics(res.data);
        } catch (error) {
            console.error('Erro ao carregar métricas', error);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedEdition && !loading) {
            fetchMetrics(selectedEdition.id);
        }
    }, [currentIndex]);

    // Como as edições vêm do BD em ordem decrescente (0 = mais nova):
    // < (Esquerda) = ir para o PASSADO (edições MAIS ANTIGAS), ou seja, AUMENTAR o índice
    const handleLeft = () => {
        if (currentIndex < editions.length - 1) setCurrentIndex(currentIndex + 1);
    };

    // > (Direita) = ir para o FUTURO (edições MAIS NOVAS), ou seja, DIMINUIR o índice
    // Permitimos chegar a -1 (futuro sem edição ainda)
    const handleRight = () => {
        if (currentIndex > -1) setCurrentIndex(currentIndex - 1);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Não definido';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center', fontFamily: tokens.typography.fontFamily }}>Carregando...</div>;
    }

    const hasOlderEditions = currentIndex < editions.length - 1;
    const hasNewerEditions = currentIndex > -1;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: tokens.colors.gray[300],
            fontFamily: tokens.typography.fontFamily,
        }}>
            <Header title="Gestão" subtitle="Gerencie as edições da competição" />

            {/* Edition Selector */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '16px',
                flexShrink: 0
            }}>
                <button 
                    onClick={handleLeft} 
                    disabled={!hasOlderEditions} 
                    style={{ background: 'none', border: 'none', cursor: hasOlderEditions ? 'pointer' : 'default', opacity: hasOlderEditions ? 1 : 0.3 }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <span style={{ fontSize: '16px', fontWeight: tokens.typography.fontWeight.semibold, color: tokens.colors.black }}>
                    {selectedEdition ? selectedEdition.name : 'Próximas Edições'}
                </span>
                <button 
                    onClick={handleRight} 
                    disabled={!hasNewerEditions} 
                    style={{ background: 'none', border: 'none', cursor: hasNewerEditions ? 'pointer' : 'default', opacity: hasNewerEditions ? 1 : 0.3 }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
            </div>

            {selectedEdition ? (
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '0 16px 80px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {/* Time Metrics */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: tokens.typography.fontWeight.medium, color: tokens.colors.gray[100] }}>Tempo</span>
                            {DashIcons.Pencil ? (
                                <button 
                                    onClick={() => setEditionModalOpen(true)}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <DashIcons.Pencil />
                                </button>
                            ) : null}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', width: '100%' }}>
                            <DashCard 
                                icon={<DashIcons.Calendar />} 
                                label="Data de Início" 
                                value={formatDate(selectedEdition.startDate)} 
                            />
                            <DashCard 
                                icon={<DashIcons.Calendar />} 
                                label="Data de Término" 
                                value={formatDate(selectedEdition.endDate)} 
                            />
                            <DashCard 
                                icon={<DashIcons.EyeOff />} 
                                label="Ocultação do Ranking" 
                                value={selectedEdition?.rankingEndDate
                                    ? new Date(selectedEdition.rankingEndDate) < new Date()
                                        ? 'Ranking oculto'
                                        : formatDate(selectedEdition.rankingEndDate)
                                    : 'Não definido'
                                }
                            />
                            <DashCard 
                                icon={<DashIcons.Clock />} 
                                label={new Date(selectedEdition.endDate) < new Date()
                                    ? 'Encerrada há'
                                    : new Date(selectedEdition.startDate) > new Date()
                                        ? 'Começa em'
                                        : 'Termina em'
                                }
                                value={`${metrics?.remainingDays ?? '--'} dias`} 
                            />
                        </div>
                    </section>

                    {/* Performance Metrics */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: tokens.typography.fontWeight.medium, color: tokens.colors.gray[100] }}>Métricas e Submissões</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', width: '100%' }}>
                            <DashCard icon={<DashIcons.CheckSquare />} label="Missões Concluídas" value={metrics?.missionsCompleted ?? '--'} />
                            <DashCard icon={<DashIcons.Sun />} label="Total de XP" value={metrics?.totalXpDistributed ?? '--'} />
                            <DashCard icon={<DashIcons.Send />} label="Subm. Recebidas" value={metrics?.submissions.received ?? '--'} />
                            <DashCard icon={<DashIcons.AlertTriangle />} label="Subm. Pendentes" value={metrics?.submissions.pending ?? '--'} />
                            <DashCard icon={<DashIcons.ThumbsUp />} label="Subm. Deferidas" value={metrics?.submissions.approved ?? '--'} />
                            <DashCard icon={<DashIcons.ThumbsDown />} label="Subm. Indeferidas" value={metrics?.submissions.rejected ?? '--'} />
                        </div>
                    </section>

                    {/* Pending Analysis */}
                    {currentIndex === activeEditionIndex && (
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: tokens.typography.fontWeight.medium, color: tokens.colors.gray[100] }}>Aguardando Análise</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {pendingSubmissions.map(sub => {
                                    const date = new Date(sub.createdAt).toLocaleString('pt-BR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    }).replace(',', ' às');

                                    return (
                                        <SubmissionCard 
                                            key={sub.id}
                                            title={sub.task.name}
                                            xp={sub.task.xp}
                                            author={sub.user.name}
                                            date={date}
                                            category={sub.task.category.name}
                                            onClick={() => setReviewingSubmission(sub)} 
                                            style={{ borderLeftColor: tokens.colors.yellow }}
                                        />
                                    );
                                })}
                                {pendingSubmissions.length === 0 && (
                                    <div style={{ textAlign: 'center', color: tokens.colors.gray[100], padding: '20px' }}>Nenhuma submissão para analisar</div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            ) : (
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '0 16px 80px 16px',
                    gap: '16px'
                }}>
                    <span style={{ 
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.titleHeader,
                        color: tokens.colors.gray[100],
                        textAlign: 'center'
                    }}>
                        Não existem mais edições
                    </span>
                    <button 
                        onClick={() => setEditionModalOpen(true)}
                        style={{
                            backgroundColor: tokens.colors.yellow,
                            border: 'none',
                            borderRadius: tokens.borderRadius.card,
                            padding: '12px 24px',
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.titleComponent,
                            fontWeight: tokens.typography.fontWeight.medium,
                            color: tokens.colors.white,
                            cursor: 'pointer'
                        }}
                    >
                        Criar nova edição
                    </button>
                </div>
            )}

            <ReviewSubmissionModal
                visible={!!reviewingSubmission}
                submission={reviewingSubmission}
                onClose={() => setReviewingSubmission(null)}
                onSuccess={fetchInitialData}
            />

            <EditionModal 
                visible={editionModalOpen}
                edition={selectedEdition}
                onClose={() => setEditionModalOpen(false)}
                onSuccess={fetchInitialData}
            />
        </div>
    );
}
