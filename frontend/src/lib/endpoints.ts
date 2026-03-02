export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Users
  GET_USER: (id: string) => `/users/${id}`,
  UPDATE_PROFILE: (id: string) => `/users/${id}/profile`,
  GET_PROFILE: (id: string) => `/users/${id}/profile`,

  // Skills
  GET_SKILLS: '/skills',
  CREATE_SKILL: '/skills',
  UPDATE_SKILL: (id: string) => `/skills/${id}`,
  DELETE_SKILL: (id: string) => `/skills/${id}`,
  GET_USER_SKILLS: (userId: string) => `/users/${userId}/skills`,

  // Matching
  GET_MATCHES: '/matching/matches',
  GET_MATCH: (id: string) => `/matching/matches/${id}`,
  CREATE_MATCH_REQUEST: '/matching/requests',
  ACCEPT_MATCH: (id: string) => `/matching/requests/${id}/accept`,
  DECLINE_MATCH: (id: string) => `/matching/requests/${id}/decline`,

  // Messaging
  GET_CONVERSATIONS: '/messaging/conversations',
  GET_CONVERSATION: (id: string) => `/messaging/conversations/${id}`,
  GET_MESSAGES: (convId: string) => `/messaging/conversations/${convId}/messages`,
  SEND_MESSAGE: (convId: string) => `/messaging/conversations/${convId}/messages`,

  // Transactions
  GET_TRANSACTIONS: '/transactions',
  CREATE_TRANSACTION: '/transactions',
  GET_TRANSACTION: (id: string) => `/transactions/${id}`,
  COMPLETE_TRANSACTION: (id: string) => `/transactions/${id}/complete`,

  // Reviews
  CREATE_REVIEW: '/reviews',
  GET_REVIEWS: (userId: string) => `/users/${userId}/reviews`,

  // Credit Wallet
  GET_WALLET: '/wallet',
  ADD_CREDITS: '/wallet/add',
  TRANSFER_CREDITS: '/wallet/transfer',
};
