import api from '@/lib/api'

export interface NotificationItem {
  id: number
  type: string
  titre: string | null
  message: string
  lien: string | null
  lue: boolean
  tous: boolean
  adminId: number | null
  utilisateurId: number | null
  abonnementId: number | null
  createdAt: string
  updatedAt: string
}

export interface NotificationsResponse {
  data: NotificationItem[]
  nonLues: number
}

export const notificationsService = {
  async getMesNotifications(): Promise<NotificationsResponse> {
    const res = await api.get('/mes-notifications')
    return res.data
  },

  async marquerLue(id: number) {
    const res = await api.put(`/mes-notifications/${id}/lue`)
    return res.data
  },

  async marquerToutesLues() {
    const res = await api.put('/mes-notifications/lues')
    return res.data
  },

  async getAdminNotifications(): Promise<NotificationsResponse> {
    const res = await api.get('/admin/notifications')
    return res.data
  },

  async adminMarquerLue(id: number) {
    const res = await api.put(`/admin/notifications/${id}/lue`)
    return res.data
  },

  async adminMarquerToutesLues() {
    const res = await api.put('/admin/notifications/lues')
    return res.data
  },
}
