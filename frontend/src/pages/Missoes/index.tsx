import React, { useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';
import { ChipCategory } from '../../ui/ChipCategory'; // Importado para os filtros
import { Chip } from '../../ui/Chip'; // Mantido para uso dentro do TaskCard
import { TaskCard } from '../../ui/TaskCard';
import { FAB } from '../../ui/FAB';
import { CreateTaskModal } from '../../ui/CreateTaskModal';
import { EditTaskModal } from '../../ui/EditTaskModal';
import { ViewTaskModal } from '../../ui/ViewTaskModal';
import { Header } from '../../ui/Header';
import { api, Session } from '../../api';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
}

export default function Missoes() {
    const [activeFilter, setActiveFilter] = useState('Todas');
    const [tasks, setTasks] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any | null>(null);
    const [viewingTask, setViewingTask] = useState<any | null>(null);
    const [editionError, setEditionError] = useState<string | null>(null);

    const isRh = Session.User?.role === 'rh';

    const fetchData = async () => {
        api.get('/categories').then(res => setCategories(res.data));
        try {
            const tasksResponse = await api.get('/tasks');
            setTasks(tasksResponse.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setEditionError(error.response.data.message || 'Erro ao carregar as tarefas');
            } else {
                setEditionError('Erro ao carregar as tarefas');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTasks = activeFilter === 'Todas' 
        ? tasks 
        : tasks.filter(t => t.category?.name === activeFilter);

    // Mapeia os chips dinamicamente
    const filters = ['Todas', ...categories.map(c => c.name)];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: tokens.colors.gray[300], // #F5F5F5 equivalent
            fontFamily: tokens.typography.fontFamily,
            position: 'relative'
        }}>
            <Header title="Missões" subtitle="Clique para competir" />

            {/* Filters */}
            <div style={{ 
                display: 'flex', 
                gap: '6px', 
                padding: '0 16px',
                overflowX: 'auto',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                flexShrink: 0, // Evita que o container encolha e esconda os chips
            }}>
                {filters.map(f => (
                    <ChipCategory // Usando ChipCategory para os filtros
                        key={f} 
                        label={f} 
                        selected={f === activeFilter}
                        onPress={() => setActiveFilter(f)}
                        style={{ whiteSpace: 'nowrap' }}
                    />
                ))}
            </div>

            {/* Task List */}
            {editionError ? (
                <div style={{
                    padding: '32px 16px',
                    textAlign: 'center',
                    fontFamily: tokens.typography.fontFamily,
                    color: tokens.colors.gray[100],
                    fontSize: tokens.typography.fontSize.titleComponent,
                    marginTop: '24px'
                }}>
                    {editionError}
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '16px',
                    paddingBottom: '80px', // Extra space for scrolling above BottomNav and FAB
                }}>
                    {filteredTasks.map(task => (
                        <TaskCard 
                            key={task.id}
                            title={task.name}
                            xp={task.xp}
                            submissions={task.remainingConclusions}
                            category={task.category?.name || 'Sem Categoria'}
                            onClick={() => setViewingTask(task)}
                            onEdit={isRh ? () => setEditingTask(task) : undefined}
                        />
                    ))}
                </div>
            )}

            {/* FAB */}
            {isRh && (
                <div style={{ position: 'fixed', bottom: '80px', right: '16px', zIndex: 10 }}>
                    <FAB onPress={() => setIsCreateModalOpen(true)} />
                </div>
            )}

            <CreateTaskModal
                visible={isCreateModalOpen}
                categories={categories}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchData}
            />
            
            <EditTaskModal
                visible={!!editingTask}
                task={editingTask}
                categories={categories}
                onClose={() => setEditingTask(null)}
                onSuccess={fetchData}
            />

            <ViewTaskModal
                visible={!!viewingTask}
                task={viewingTask}
                onClose={() => setViewingTask(null)}
            />
        </div>
    );
}