import api from '../api'

export interface CreateCommandeData {
  sessionId: string
  utilisateurNom: string
  utilisateurEmail: string
  utilisateurTelephone: string
  adresseLivraison?: string
  notes?: string
}

export const commandesService = {
  create(data: CreateCommandeData) { return api.post('/commandes/create', data) },
  getByNumero(numero: string) { return api.get(`/commandes/view/${numero}`) },
  historique(email: string) { return api.post('/commandes/historique', { email }) },
  getAll() { return api.get('/commandes') },
  updateStatut(id: number, statut: string) { return api.put(`/commandes/statut/${id}`, { statut }) },
}
