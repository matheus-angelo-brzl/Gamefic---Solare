import { useMemo, useState, useEffect, useRef } from 'react';
import { api, Session } from '../../api';
import { tokens } from '../../styles/tokens';
import { Header } from '../../ui/Header';
import { SegmentedControl } from '../../ui/SegmentedControl'; // Importar SegmentedControl
import { RankingCard } from '../../ui/RankingCard';
import { io } from 'socket.io-client';
import axios from 'axios';

type RankingScope = 'edition' | 'annual' | 'general';

interface RankingMember {
  id: string;
  name: string;
  role: string;
  xp: number;
  wins: number;
  trend: number;
  isCurrentUser?: boolean;
}

interface RankingTab {
  key: RankingScope;
  label: string;
  caption: string;
}

const TABS: RankingTab[] = [
  { key: 'edition', label: 'Edição', caption: 'Temporada atual' },
  { key: 'annual', label: 'Anual', caption: 'Acumulado do ano' },
  { key: 'general', label: 'Geral', caption: 'Todo o histórico' },
];

export default function Rankings() {
  const [activeTab, setActiveTab] = useState<RankingScope>('edition');
  const [ranking, setRanking] = useState<RankingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previousOrderRef = useRef<string[]>([]);
  const currentTabRef = useRef<RankingScope>('edition');

  const fetchRanking = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const response = await api.get<RankingMember[]>(`/ranking/${activeTab}`);
      const apiData = Array.isArray(response.data) ? response.data : [];

      const dataWithCurrentUser = apiData.map((member) => ({
        ...member,
        isCurrentUser: member.id === Session.User.id,
      }));

      if (currentTabRef.current === activeTab && !showLoading) {
        // Guarda a ordem anterior apenas se não houver carregamento explícito da página
        // para dar o efeito de mudança só quando as coisas ocorrem via websocket
        setRanking(prev => {
          previousOrderRef.current = prev.map(r => r.id);
          return dataWithCurrentUser;
        });
      } else {
        previousOrderRef.current = [];
        currentTabRef.current = activeTab;
        setRanking(dataWithCurrentUser);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.status === 403) {
        return setError(err.response.data.message);
      }
      console.error('Failed to fetch ranking:', err);
      setError('Não foi possível carregar o ranking.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [activeTab, Session.User.id]);

  useEffect(() => {
    const socket = io(`${api.defaults.baseURL}/ranking`, {
      auth: { token: Session.AuthToken },
    });

    socket.on('rankingUpdate', () => {
      fetchRanking(false); // Update without showing loading state
    });

    return () => {
      socket.disconnect();
    };
  }, [activeTab]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: tokens.colors.gray[300],
          fontFamily: tokens.typography.fontFamily,
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.colors.gray[100],
        }}
      >
        Carregando ranking...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: tokens.colors.gray[300],
        fontFamily: tokens.typography.fontFamily,
        position: 'relative',
      }}
    >
      <Header title="Rankings" subtitle="Conclua tarefas para participar" />

      {/* Filters with SegmentedControl */}
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px', // Adicionado margem aqui para separar do grid
        }}
      >
        <SegmentedControl
          options={TABS}
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key as RankingScope)}
          style={{ width: '100%', maxWidth: '600px' }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '0 16px', // Ajusta o padding para as laterais
          paddingBottom: '80px', // Extra space for scrolling above BottomNav and FAB
        }}
      >
        {ranking.length === 0 ? (
          <p
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              fontFamily: tokens.typography.fontFamily,
              color: tokens.colors.gray[100],
              fontSize: tokens.typography.fontSize.titleComponent,
              marginTop: '24px',
            }}
          >
            {error ? <span>{error}</span> : <span>Não há o que exibir ainda.<br />Conclua tarefas para aparecer aqui!</span>}
          </p>
        ) : (
          ranking.map((member, index) => {
            const oldIndex = previousOrderRef.current.indexOf(member.id);
            const moved = oldIndex !== -1 && oldIndex !== index;

            return (
              <RankingCard
                key={member.id}
                id={member.id}
                name={member.name}
                role={member.role}
                xp={member.xp}
                wins={member.wins}
                position={index + 1}
                isCurrentUser={member.isCurrentUser}
                trend={member.trend}
                moved={moved}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
