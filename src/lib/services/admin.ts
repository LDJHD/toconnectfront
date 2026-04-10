import api from '../api'

export const adminService = {
  login(data: { email: string; password: string }) {
    return api.post('/admins/login', { email: data.email, motDePasse: data.password })
  },
  createAdmin(data: { email: string; motDePasse: string }) {
    return api.post('/admins/create', data)
  },
  getAdmins() { return api.get('/admins') },
  forgotPassword(email: string) { return api.post('/admins/forgot-password', { email }) },
  resetPassword(data: { email: string; code: string; nouveauMotDePasse: string }) {
    return api.post('/admins/reset-password', data)
  },
  getNotifications() { return api.get('/notifications') },
  getComptes() { return api.get('/comptes') },
  createCompte(data: any) { return api.post('/comptescreate', data) },
  updateCompte(id: number, data: any) { return api.put(`/comptes/update/${id}`, data) },
  deleteCompte(id: number) { return api.delete(`/comptes/delete/${id}`) },
  getProfils() { return api.get('/profils') },
  getUtilisateurs() { return api.get('/utilisateurs') },
  // Type comptes (admin CRUD) - multipart pour image
  createTypeCompte(data: FormData) {
    return api.post('/type_comptescreate', data)
  },
  updateTypeCompte(id: number, data: FormData) {
    return api.put(`/type_comptes/update/${id}`, data)
  },
  deleteTypeCompte(id: number) { return api.delete(`/type_comptes/delete/${id}`) },
}
