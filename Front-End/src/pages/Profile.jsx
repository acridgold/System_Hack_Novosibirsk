import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    TextField,
    Button,
    Divider,
    Card,
    CardContent,
    Chip,
    Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Person,
    Email,
    Work,
    CalendarToday,
    Edit,
    Save,
    Assessment,
    TrendingDown,
} from '@mui/icons-material';

const MotionPaper = motion.create(Paper);
const MotionCard = motion.create(Card);

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'Иван Петров',
        email: user?.email || 'ivan.petrov@sdek.ru',
        position: user?.position || 'Менеджер логистики',
        department: user?.department || 'Отдел доставки',
        joinDate: user?.joinDate || '2022-01-15',
    });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSave = () => {
        // Здесь будет логика сохранения на backend
        setEditMode(false);
    };

    const stats = [
        { label: 'Тестов пройдено', value: '8', icon: <Assessment />, color: 'primary' },
        { label: 'Средний уровень', value: 'Средний', icon: <TrendingDown />, color: 'warning' },
        { label: 'Дней в системе', value: '127', icon: <CalendarToday />, color: 'info' },
        { label: 'Выполнено советов', value: '24', icon: <TrendingDown />, color: 'success' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Column - Profile Info */}
                <Grid item xs={12} md={4}>
                    <MotionPaper
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        elevation={3}
                        sx={{ p: 4, textAlign: 'center' }}
                    >
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                mx: 'auto',
                                mb: 2,
                                bgcolor: 'primary.main',
                                fontSize: '3rem',
                            }}
                        >
                            {formData.name.charAt(0)}
                        </Avatar>

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {formData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formData.position}
                        </Typography>
                        <Chip label="Активен" color="success" size="small" sx={{ mt: 1 }} />

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={2} textAlign="left">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{formData.email}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Work fontSize="small" color="action" />
                                <Typography variant="body2">{formData.department}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday fontSize="small" color="action" />
                                <Typography variant="body2">С {new Date(formData.joinDate).toLocaleDateString('ru-RU')}</Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={editMode ? <Save /> : <Edit />}
                            onClick={editMode ? handleSave : () => setEditMode(true)}
                            sx={{ mt: 3 }}
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {editMode ? 'Сохранить' : 'Редактировать'}
                        </Button>
                    </MotionPaper>
                </Grid>

                {/* Right Column - Stats and Settings */}
                <Grid item xs={12} md={8}>
                    {/* Statistics */}
                    <MotionPaper
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        elevation={3}
                        sx={{ p: 3, mb: 3 }}
                    >
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Статистика
                        </Typography>
                        <Grid container spacing={2} mt={1}>
                            {stats.map((stat, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <MotionCard
                                        whileHover={{ scale: 1.05 }}
                                        elevation={1}
                                        sx={{ textAlign: 'center', p: 2 }}
                                    >
                                        <Avatar sx={{ bgcolor: `${stat.color}.main`, mx: 'auto', mb: 1 }}>
                                            {stat.icon}
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="bold" color={`${stat.color}.main`}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionPaper>

                    {/* Edit Form */}
                    <MotionPaper
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        elevation={3}
                        sx={{ p: 3 }}
                    >
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Информация профиля
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Stack spacing={3}>
                            <TextField
                                label="Имя"
                                value={formData.name}
                                onChange={handleChange('name')}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} /> }}
                            />
                            <TextField
                                label="Email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} /> }}
                            />
                            <TextField
                                label="Должность"
                                value={formData.position}
                                onChange={handleChange('position')}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} /> }}
                            />
                            <TextField
                                label="Отдел"
                                value={formData.department}
                                onChange={handleChange('department')}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} /> }}
                            />
                            <TextField
                                label="Дата присоединения"
                                type="date"
                                value={formData.joinDate}
                                onChange={handleChange('joinDate')}
                                disabled={!editMode}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} /> }}
                            />
                        </Stack>
                    </MotionPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
