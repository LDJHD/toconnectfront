import api from '../api'

export const abonnementsService = {
  // Type de comptes (plans disponibles)
  getTypeComptes() { return api.get('/type_comptes') },
  getTypeCompteById(id: number) { return api.get(`/type_comptes/${id}`) },
  // Créer un abonnement
  create(data: {
    email: string
    nom: string
    telephone: string
    typeCompteId: number
    duree: number
    montant: number
  }) { return api.post('/abonnementscreate', data) },
  // Lister / voir
  getAll() { return api.get('/abonnements') },
  getById(id: number) { return api.get(`/abonnements/${id}`) },
  // Renouveler
  renouveler(id: number, data: any) { return api.put(`/abonnements/reabonnement/${id}`, data) },
}
