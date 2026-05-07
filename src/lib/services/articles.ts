import api from '../api'

export const articlesService = {
  getAll(params?: any) { return api.get('/articles', { params }) },
  getAllAdmin() { return api.get('/articles/admin') },
  getById(id: number) { return api.get(`/articles/${id}`) },
  featured() { return api.get('/articles/featured') },
  byCategory(categoryId: number) { return api.get(`/articles/category/${categoryId}`) },
  search(query: string) { return api.post('/articles/search', { query }) },

  create(data: FormData) {
    return api.post('/articles/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update(id: number, data: FormData) {
    return api.put(`/articles/update/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete(id: number) { return api.delete(`/articles/delete/${id}`) },
  deleteImage(imageId: number) { return api.delete(`/articles/image/${imageId}`) },
}
