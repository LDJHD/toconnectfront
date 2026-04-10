import api from '../api'

export const categoriesService = {
  getAll() { return api.get('/categories') },
  all() { return api.get('/categories/all') },
  getById(id: number) { return api.get(`/categories/${id}`) },
  getSousCategories(categoryId: number) { return api.get(`/sous-categories/${categoryId}`) },
  create(data: any) { return api.post('/categories/create', data) },
  update(id: number, data: any) { return api.put(`/categories/update/${id}`, data) },
  delete(id: number) { return api.delete(`/categories/delete/${id}`) },
}
