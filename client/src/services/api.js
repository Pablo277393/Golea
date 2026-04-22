import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('golea_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/users/me'),
  getUsersByRole: (role) => api.get('/users', { params: { role } }),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const teamService = {
  getTeams: (params) => api.get('/teams', { params }),
  getTeam: (id) => api.get(`/teams/${id}`),
  createTeam: (data) => api.post('/teams', data),
  updateTeam: (id, data) => api.put(`/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  getTeamPlayers: (id) => api.get(`/teams/${id}/players`),
  addPlayerToTeam: (teamId, playerData) => api.post(`/teams/${teamId}/players`, playerData),
  removePlayerFromTeam: (teamId, playerId) => api.delete(`/teams/${teamId}/players/${playerId}`),
};

export const matchService = {
  getMatches: () => api.get('/matches'),
  createMatch: (data) => api.post('/matches', data),
  publishMatch: (id) => api.patch(`/matches/${id}/publish`),
  updateScore: (id, scores) => api.patch(`/matches/${id}/score`, scores),
  deleteMatch: (id) => api.delete(`/matches/${id}`),
};

export const trainingService = {
  getTrainings: () => api.get('/trainings'),
  createTraining: (data) => api.post('/trainings', data),
  getCallups: (type, id) => api.get(`/trainings/callups/${type}/${id}`),
  updateCallups: (type, id, playerIds) => api.post(`/trainings/callups/${type}/${id}`, { player_ids: playerIds }),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  sendNotification: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

export const gamificationService = {
  getPredictions: () => api.get('/gamification/predictions'),
  getCombo: () => api.get('/gamification/combo'),
  submitPredictions: (data) => api.post('/gamification/predictions', data),
  getWeeklyPrize: () => api.get('/gamification/prizes/active'),
  getMVP: (teamId, week, year) => api.get(`/gamification/mvp/${teamId}/${week}/${year}`),
  voteMVP: (data) => api.post('/gamification/mvp/vote', data),
};

export const adService = {
  getRandomAd: () => api.get('/ads'),
  trackClick: (id) => api.post(`/ads/${id}/click`),
  trackImpression: (id) => api.post(`/ads/${id}/impression`),
  // Admin Only
  getAllAds: () => api.get('/ads/all'),
  createAd: (formData) => api.post('/ads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateAd: (id, formData) => api.put(`/ads/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAd: (id) => api.delete(`/ads/${id}`),
};

export const playerService = {
  generateLinkingCode: () => api.post('/player/generate-linking-code'),
};

export const parentService = {
  getPlayers: () => api.get('/parent/players'),
  linkPlayer: (linkingCode) => api.post('/parent/link-player', { linkingCode }),
  getNotifications: () => api.get('/parent/notifications'),
  getMatches: () => api.get('/parent/matches'),
  getCalendarMatches: () => api.get('/parent/calendar/matches'),
  getUpcomingMatches: () => api.get('/parent/upcoming-matches'),
};

export default api;
