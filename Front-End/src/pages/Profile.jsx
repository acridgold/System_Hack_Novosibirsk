import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Person,
    Email,
    Work,
    CalendarToday,
    Edit,
    Save,
    Assessment,
    TrendingDown,
    Logout,
    Login as LoginIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { logout } from '../store/slices/userSlice';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.user);
    const { burnoutLevel, history } = useSelector((state) => state.assessment);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        position: user?.position || '',
        department: user?.department || '',
        joinDate: user?.joinDate || '',
    });
    const [formLoading, setFormLoading] = useState(false);

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSave = async () => {
        setFormLoading(true);
        try {
            const result = await api.put(`/users/${user.id}`, formData);
            // Обновляем пользователя в Redux
            dispatch({ type: 'user/updateUser', payload: result });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // ===== ЕСЛИ НЕ АВТОРИЗОВАН =====
    if (!isAuthenticated && !authLoading) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        backgroundColor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box
                        sx={{
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'primary.main',
                                fontSize: '3rem',
                            }}
                        >
                            <PersonIcon sx={{ fontSize: '3rem' }} />
                        </Avatar>
                    </Box>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Профиль
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        Вы не вошли в систему. Чтобы увидеть ваш профиль и результаты диагностики, пожалуйста, авторизуйтесь.
                    </Typography>

                    <Stack spacing={2}>
                        <Alert severity="info">
                            Без авторизации ваши данные хранятся только локально и теряются при перезагрузке страницы.
                        </Alert>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<LoginIcon />}
                            onClick={() => navigate('/login')}
                            sx={{ py: 2 }}
                        >
                            Войти в систему
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/')}
                        >
                            Вернуться на главную
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Преимущества авторизации:
                    </Typography>
                    <Stack spacing={1} sx={{ textAlign: 'left', ml: 2, mt: 2 }}>
                        <Typography variant="body2">✓ Сохранение результатов в базе данных</Typography>
                        <Typography variant="body2">✓ Персональные рекомендации</Typography>
                        <Typography variant="body2">✓ История всех диагностик</Typography>
                        <Typography variant="body2">✓ Доступ с разных устройств</Typography>
                        <Typography variant="body2">✓ Отслеживание прогресса</Typography>
                    </Stack>
                </Box>
            </Container>
        );
    }

    // ===== ЕСЛИ АВТОРИЗОВАН =====
    if (authLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    const stats = [
        {
            label: 'Текущий уровень',
            value: burnoutLevel || 'Не определен',
            icon: <Assessment />,
            color: burnoutLevel === 'high' ? 'error' : burnoutLevel === 'medium' ? 'warning' : 'success'
        },
        {
            label: 'Всего тестов',
            value: history?.length || 0,
            icon: <Assessment />,
            color: 'primary'
        },
        {
            label: 'Дней в системе',
            value: user?.daysInSystem || '1',
            icon: <CalendarToday />,
            color: 'info'
        },
        {
            label: 'Рекомендаций выполнено',
            value: user?.completedRecommendations || '0',
            icon: <TrendingDown />,
            color: 'success'
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Column - Profile Info */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        {/* Avatar */}
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
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>

                        {/* User Name */}
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {user?.name || 'Пользователь'}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {user?.position || 'Должность не указана'}
                        </Typography>

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Chip
                                label="Активен"
                                color="success"
                                variant="outlined"
                                size="small"
                            />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Contact Info */}
                        <Stack spacing={2} sx={{ textAlign: 'left', mb: 3 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{user?.email}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Work fontSize="small" color="action" />
                                <Typography variant="body2">{user?.department || 'Не указано'}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday fontSize="small" color="action" />
                                <Typography variant="body2">
                                    С {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('ru-RU') : 'Недавно'}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Action Buttons */}
                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={editMode ? <Save /> : <Edit />}
                                onClick={editMode ? handleSave : () => setEditMode(true)}
                                disabled={formLoading}
                                fullWidth
                            >
                                {editMode ? 'Сохранить' : 'Редактировать'}
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Logout />}
                                onClick={handleLogout}
                                fullWidth
                            >
                                Выход
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Column - Stats and Settings */}
                <Grid item xs={12} md={8}>
                    {/* Statistics */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Статистика
                        </Typography>
                        <Grid container spacing={2} mt={1}>
                            {stats.map((stat, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Card elevation={1} sx={{ textAlign: 'center', p: 2 }}>
                                        <Avatar sx={{ bgcolor: `${stat.color}.main`, mx: 'auto', mb: 1 }}>
                                            {stat.icon}
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="bold" color={`${stat.color}.main`}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* Edit Form */}
                    {editMode && (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Редактирование профиля
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <TextField
                                    label="Имя"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    fullWidth
                                    InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} /> }}
                                />
                                <TextField
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    fullWidth
                                    type="email"
                                    disabled
                                    InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} /> }}
                                />
                                <TextField
                                    label="Должность"
                                    value={formData.position}
                                    onChange={handleChange('position')}
                                    fullWidth
                                    InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} /> }}
                                />
                                <TextField
                                    label="Отдел"
                                    value={formData.department}
                                    onChange={handleChange('department')}
                                    fullWidth
                                    InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} /> }}
                                />
                                <TextField
                                    label="Дата присоединения"
                                    type="date"
                                    value={formData.joinDate}
                                    onChange={handleChange('joinDate')}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    disabled
                                    InputProps={{ startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} /> }}
                                />

                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        disabled={formLoading}
                                        fullWidth
                                    >
                                        {formLoading ? 'Сохранение...' : 'Сохранить изменения'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setEditMode(false)}
                                        fullWidth
                                    >
                                        Отмена
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    )}

                    {/* Recent Tests */}
                    {!editMode && (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                История тестов
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {history && history.length > 0 ? (
                                <Stack spacing={2}>
                                    {history.slice(-5).reverse().map((test, index) => (
                                        <Card key={index} elevation={1}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {new Date(test.timestamp).toLocaleDateString('ru-RU')}
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="bold">
                                                            Уровень выгорания: {test.burnoutLevel}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={`Баллы: ${test.score || 'N/A'}`}
                                                        color={test.burnoutLevel === 'high' ? 'error' : test.burnoutLevel === 'medium' ? 'warning' : 'success'}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            ) : (
                                <Alert severity="info">
                                    У вас пока нет пройденных тестов. <strong>Начните диагностику</strong> чтобы увидеть результаты.
                                </Alert>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
