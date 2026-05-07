import api from '../api'

export const panierService = {
  get(sessionId: string) { return api.get(`/panier/${sessionId}`) },
  addItem(data: { sessionId: string; articleId?: number; packId?: number; quantite: number }) { return api.post('/panier/add', data) },
  updateItem(itemId: number, data: { quantite: number }) { return api.put(`/panier/update/${itemId}`, data) },
  removeItem(itemId: number) { return api.delete(`/panier/remove/${itemId}`) },
  clear(sessionId: string) { return api.delete(`/panier/clear/${sessionId}`) },
}
