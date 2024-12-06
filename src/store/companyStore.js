//src/store/companyStore.js
import { create } from 'zustand';

export const useCompanyStore = create((set) => ({
  companies: [],
  isLoading: false,
  error: null,
  setCompanies: (companies) => set({ companies }),
  removeCompany: (id) => set(state => ({
    companies: state.companies.filter(company => company._id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));