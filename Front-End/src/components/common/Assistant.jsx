import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Paper, Typography, CircularProgress } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

// Простая оболочка для будущего AI-ассистента с анимацией и обменом сообщений
export default function Assistant() {
    // minimized: свёрнуто (иконка) — если true, показываем маленькую кнопку
    const [minimized, setMinimized] = useState(true);
    const [firstShowDone, setFirstShowDone] = useState(false);

    // Messaging state
    const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', text}
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const messagesRef = useRef(null);

    useEffect(() => {
        // Показываем окно только если страница только что обновлена (sessionStorage флаг)
        const shownOnLoad = sessionStorage.getItem('assistant_shown_on_load');
        if (!shownOnLoad) {
            // Показать на load: развернуто
            setMinimized(false);
            sessionStorage.setItem('assistant_shown_on_load', '1');
            setFirstShowDone(true);
        } else {
            // Уже показывали на этой сессии — оставить свернутым
            const saved = sessionStorage.getItem('assistant_minimized');
            setMinimized(saved !== null ? saved === '1' : true);
            setFirstShowDone(true);
        }

        // Попытаемся загрузить историю чата из sessionStorage (в рамках сессии)
        try {
            const raw = sessionStorage.getItem('assistant_messages');
            if (raw) setMessages(JSON.parse(raw));
        } catch (e) {
            // ignore
        }
    }, []);

    useEffect(() => {
        // При переходах по вкладкам сохраняем состояние свернутости и историю
        if (firstShowDone) {
            sessionStorage.setItem('assistant_minimized', minimized ? '1' : '0');
            try {
                sessionStorage.setItem('assistant_messages', JSON.stringify(messages.slice(-30)));
            } catch (e) {
                // ignore
            }
        }
    }, [minimized, firstShowDone, messages]);

    // Закрывать по Escape для удобства
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setMinimized(true);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        // scroll to bottom when messages change
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const toggle = () => setMinimized(prev => !prev);

    const sendMessage = async (text) => {
        if (!text || isLoading) return;
        setError(null);

        const userMsg = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: text });
            const reply = res && res.reply ? res.reply : 'Извините, пустой ответ от сервера.';
            const botMsg = { role: 'assistant', text: reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error('AI chat error:', err);
            setError(err.message || 'Network error');
            const botMsg = { role: 'assistant', text: 'Ошибка: не удалось получить ответ. Попробуйте ещё раз.' };
            setMessages(prev => [...prev, botMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (e) => {
        e?.preventDefault?.();
        if (!input.trim()) return;
        sendMessage(input.trim());
    };

    const panelVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.98 }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
    };

    return (
        <Box
            sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1400 }}
            aria-live="polite"
        >
            <AnimatePresence initial={false} mode="wait">
                {minimized ? (
                    <motion.div
                        key="assistant-btn"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={buttonVariants}
                        transition={{ duration: 0.18 }}
                    >
                        <Paper elevation={6} sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                            <IconButton aria-label="Open assistant" onClick={toggle} size="large">
                                <ChatBubbleOutlineIcon />
                            </IconButton>
                        </Paper>
                    </motion.div>
                ) : (
                    <motion.div
                        key="assistant-panel"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={panelVariants}
                        transition={{ duration: 0.22 }}
                    >
                        <Paper elevation={8} sx={{ width: 320, maxWidth: '90vw', p: 1.5 }} role="dialog" aria-label="AI Assistant" aria-expanded={!minimized}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1">AI Ассистент</Typography>
                                <IconButton aria-label="Close assistant" onClick={() => setMinimized(true)} size="large">
                                    <CloseRoundedIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ minHeight: 140, maxHeight: 300, overflow: 'auto', mb: 1 }} ref={messagesRef}>
                                {messages.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">Как Ваш день?</Typography>
                                )}

                                {messages.map((m, idx) => (
                                    <Box key={idx} sx={{ my: 0.5, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <Paper sx={{ p: 1, maxWidth: '80%', backgroundColor: m.role === 'user' ? '#DCF8C6' : '#F1F0F0' }}>
                                            <Typography variant="body2">{m.text}</Typography>
                                        </Paper>
                                    </Box>
                                ))}

                                {isLoading && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
                                        <CircularProgress size={18} />
                                        <Typography variant="caption" sx={{ ml: 1 }}>Ассистент печатает...</Typography>
                                    </Box>
                                )}

                                {error && (
                                    <Typography variant="caption" color="error">{error}</Typography>
                                )}
                            </Box>

                            <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Напишите сообщение..."
                                    style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd' }}
                                    disabled={isLoading}
                                />
                                <IconButton aria-label="Send" onClick={onSubmit} size="large" disabled={isLoading || !input.trim()}>
                                    {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                                </IconButton>
                            </Box>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}
