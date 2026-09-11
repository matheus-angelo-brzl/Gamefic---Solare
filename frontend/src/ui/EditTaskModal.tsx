import React, { useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';
import { FormModal } from './FormModal';
import { Input } from './Input';
import { Switch } from './Switch';
import { Button } from './Button';
import { Notification } from './Notification';
import { api } from '../api';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
}

interface Task {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    category?: { name: string };
    xp: number;
    maxConclusions: number | null;
    repeatNextEdition: boolean;
}

interface EditTaskModalProps {
    visible: boolean;
    task: Task | null;
    categories: Category[];
    onClose: () => void;
    onSuccess?: () => void;
}

interface ValidationError {
  path: string[];
  message: string;
}

export const EditTaskModal = ({ visible, task, categories, onClose, onSuccess }: EditTaskModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [xp, setXp] = useState('');
    const [maxConclusions, setMaxConclusions] = useState('');
    const [repeatNextEdition, setRepeatNextEdition] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'error' });

    useEffect(() => {
        if (visible) {
            setErrors({});
            setNotification({ message: '', type: 'error' });
        }
    }, [visible]);

    // Preenche os campos quando a task muda
    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description);
            setXp(String(task.xp));
            setMaxConclusions(task.maxConclusions ? String(task.maxConclusions) : '');
            setRepeatNextEdition(task.repeatNextEdition);
            
            if (task.category?.name) {
                setCategoryName(task.category.name);
            } else {
                const cat = categories.find(c => c.id === task.categoryId);
                setCategoryName(cat ? cat.name : '');
            }
        }
    }, [task, categories]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleSubmit = async () => {
        if (loading || !task) return;

        setLoading(true);
        setErrors({});
        
        try {
            await api.patch(`/tasks/${task.id}`, {
                name: name.trim(),
                description: description.trim(),
                categoryName: categoryName.trim(),
                xp: Number(xp),
                maxConclusions: maxConclusions ? Number(maxConclusions) : null,
                repeatNextEdition,
            });

            showToast('Missão atualizada com sucesso!', 'success');
            onSuccess?.();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors && Array.isArray(data.errors)) {
                    const newErrors: Record<string, string> = {};
                    data.errors.forEach((err: ValidationError) => {
                        if (err.path && err.path.length > 0) {
                            newErrors[err.path[0]] = err.message.replace(/\.$/, "");
                        }
                    });
                    setErrors(newErrors);
                } else if (data.message) {
                    showToast(data.message, 'error');
                } else {
                    showToast('Erro ao atualizar missão.', 'error');
                }
            } else {
                showToast('Erro desconhecido. Tente novamente.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: 'error' })} />
            <FormModal
                visible={visible}
                title="Editar missão"
                onClose={onClose}
                footer={
                    <Button label="Atualizar" onPress={handleSubmit} loading={loading} style={{ width: '100%' }} />
                }
            >
                <Input label="Título" value={name} onChange={setName} placeholder="Título" error={errors.name} />

                <div style={{ position: 'relative' }}>
                    <Input 
                        label="Categoria" 
                        value={categoryName} 
                        onChange={setCategoryName} 
                        placeholder="Categoria" 
                        error={errors.categoryName} 
                        list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name} />
                        ))}
                    </datalist>
                </div>

                <div style={{ display: 'flex', gap: tokens.spacing.card }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Input label="Pontuação" value={xp} onChange={setXp} placeholder="XP" error={errors.xp} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Input label="Máx Conclusões" value={maxConclusions} onChange={setMaxConclusions} placeholder="Máx" error={errors.maxConclusions} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.text }}>
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.subtitleHeader,
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.gray[100],
                    }}>
                        Descrição
                    </span>
                    <div style={{
                        border: `1px solid ${errors.description ? tokens.colors.error : tokens.colors.gray[200]}`,
                        borderRadius: tokens.borderRadius.card,
                        paddingInline: tokens.spacing.card,
                        paddingBlock: tokens.spacing.card,
                        backgroundColor: tokens.colors.white,
                    }}>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Descrição"
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: tokens.typography.fontFamily,
                                fontSize: tokens.typography.fontSize.titleComponent,
                                color: tokens.colors.black,
                                background: 'transparent',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    {errors.description && (
                        <span style={{
                            fontFamily: tokens.typography.fontFamily,
                            fontSize: tokens.typography.fontSize.subtitleComponent,
                            color: tokens.colors.error,
                        }}>
                            {errors.description}
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.card }}>
                    <span style={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.fontSize.subtitleHeader,
                        color: tokens.colors.black,
                        flex: 1,
                    }}>
                        Usar na próxima edição?
                    </span>
                    <Switch value={repeatNextEdition} onToggle={setRepeatNextEdition} />
                </div>
            </FormModal>
        </div>
    );
};
