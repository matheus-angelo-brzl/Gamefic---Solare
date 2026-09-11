import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { tokens } from '../../styles/tokens';
import { DashboardItem } from '../../ui/DashboardItem';
import { Chip } from '../../ui/Chip';
import { MemberSubmissionCard } from '../../ui/TaskCard';
import { ViewSubmissionModal } from '../../ui/ViewSubmissionModal';
import { api, Session } from '../../api/index';
import { SunIcon } from '../../assets/icons/SunIcon';
import { FlameIcon } from '../../assets/icons/FlameIcon';
import { RibbonIcon } from '../../assets/icons/RibbonIcon';
import { TrophyOutlineIcon } from '../../assets/icons/TrophyOutlineIcon';
import { CheckSquareIcon } from '../../assets/icons/CheckSquareIcon';
import { LightningIcon } from '../../assets/icons/LightningIcon';
import Trophy1 from '../../assets/icons/Trophy1.svg?react';
import Trophy2 from '../../assets/icons/Trophy2.svg?react';
import Trophy3 from '../../assets/icons/Trophy3.svg?react';
import Logout from '../../assets/icons/Logout.svg?react';

export default function Perfil() {
  const [userData, setUserData] = useState<any>(null);
  const [submissions, setSubmissions] = useState([]);
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      if (!Session.isAuthenticated()) {
        Session.logoutAndRedirect();
        return;
      }

      const [submissionsResponse, metricsResponse] = await Promise.all([
        api.get('/submissions'),
        api.get('/metrics')
      ]);

      if (submissionsResponse.data) {
        setSubmissions(submissionsResponse.data);
      }

      const data = metricsResponse.data;
      if (data) {
        setUserData({
          name: data.name || Session.User?.name || 'Utilizador',
          email: data.email || Session.User?.email || '',
          role: data.role || Session.User?.role || 'member',

          currentXp: data.xpCount || 0,
          recordXp: data.recordXp || 0,
          currentPosition: data.position ? `${data.position}º lugar` : '-',
          recordPosition: data.recordPosition ? `${data.recordPosition}º lugar` : '-',
          currentMissions: data.missionsCount || 0,
          recordMissions: data.recordMissions || 0,

          firstPlaceCount: data.firstPlaceCount || 0,
          secondPlaceCount: data.secondPlaceCount || 0,
          thirdPlaceCount: data.thirdPlaceCount || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil via API:', error);
    }
  }

  if (!userData) {
    return <div style={{ padding: '20px', textAlign: 'center', fontFamily: tokens.typography.fontFamily }}>Carregando...</div>;
  }

  const renderTrophyShelf = () => {
    const shelf = [];
    for (let i = 0; i < userData.firstPlaceCount; i++) {
      shelf.push(<Trophy1 key={`gold-${i}`}/>)
    }
    for (let i = 0; i < userData.secondPlaceCount; i++) {
      shelf.push(<Trophy2 key={`silver-${i}`}/>)
    }
    for (let i = 0; i < userData.thirdPlaceCount; i++) {
      shelf.push(<Trophy3 key={`bronze-${i}`}/>)
    }

    if (shelf.length === 0) {
      return null;
    }

    return (
      <section className="perfil-section">
        <h3 className="section-title">Coleção de Troféus</h3>
        <div className="trophy-shelf">{shelf}</div>
      </section>
    );
  };

  return (
    <div className="perfil-container">
      <header className="perfil-header" style={{ position: 'relative' }}>
        {Logout({ style: { cursor: 'pointer', position: 'absolute', width: '28px', height: '28px', top: '28px', right: '28px' }, onClick: () => Session.logoutAndRedirect() }) as React.ReactElement}
        <div className="avatar-placeholder">{userData.name.charAt(0).toUpperCase()}</div>
        <h1>{userData.name}</h1>
        <h2>{userData.email}</h2>
      </header>

      <main className="perfil-content">
        <section className="perfil-section">
          <h3 className="section-title">Estatísticas</h3>
          <div className="stats-grid-2x3">
            <DashboardItem icon={<SunIcon />} label="XP na Edição" value={userData.currentXp} />
            <DashboardItem icon={<FlameIcon />} label="Recorde de XP" value={userData.recordXp} />

            <DashboardItem
              icon={<RibbonIcon />}
              label="Posição na Edição"
              value={userData.currentPosition}
            />
            <DashboardItem
              icon={<TrophyOutlineIcon />}
              label="Recorde de Posição"
              value={userData.recordPosition}
            />

            <DashboardItem
              icon={<CheckSquareIcon />}
              label="Missões na Edição"
              value={userData.currentMissions}
            />
            <DashboardItem
              icon={<LightningIcon />}
              label="Recorde de Missões"
              value={userData.recordMissions}
            />
          </div>
        </section>

        {renderTrophyShelf()}

        <section className="perfil-section">
          <h3 className="section-title">Histórico de Submissões</h3>
          <div className="submissions-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submissions.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#717171' }}>Não há submissões para exibir</p>
            ) : (
              submissions.map((sub: any) => {
                const date = new Date(sub.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }).replace(',', ' às');

                return (
                  <MemberSubmissionCard
                    key={sub.id}
                    title={sub.task?.name || 'Missão'}
                    xp={sub.task?.xp || 0}
                    category={sub.task?.category?.name || 'Geral'}
                    status={sub.status}
                    date={date}
                    onClick={() => setViewingSubmission(sub)}
                  />
                );
              })
            )}
          </div>
        </section>
      </main>

      <ViewSubmissionModal
        visible={!!viewingSubmission}
        submission={viewingSubmission}
        onClose={() => setViewingSubmission(null)}
      />
    </div>
  );
}
