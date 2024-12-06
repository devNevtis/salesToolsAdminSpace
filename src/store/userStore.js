// src/store/userStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  managers: [],
  companies: [],
  isLoading: false,
  error: null,
  
  setUsers: (users) => set({ users }),
  setManagers: (managers) => set({ managers }),
  setCompanies: (companies) => set({ companies }),
  
  removeUser: (id) => set(state => ({
    users: state.users.filter(user => user._id !== id)
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Helper para filtrar managers por compañía
  getManagersByCompany: (state) => (companyId) => {
    return state.managers.filter(manager => manager.companyId === companyId);
  },
  
  // Reset store
  reset: () => set({
    users: [],
    managers: [],
    companies: [],
    isLoading: false,
    error: null
  })
}));