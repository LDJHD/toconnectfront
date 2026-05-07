import api from '../api'

export const packsService = {
  create(data: { nom: string; sessionId: string; items: { articleId: number; quantite: number }[] }) {
    return api.post('/packs/create', data)
  },
  getById(id: number) { return api.get(`/packs/${id}`) },
  update(id: number, data: any) { return api.put(`/packs/update/${id}`, data) },
  addItem(data: { packId: number; articleId: number; quantite: number }) { return api.post('/packs/add-item', data) },
  removeItem(itemId: number) { return api.delete(`/packs/remove-item/${itemId}`) },
}
