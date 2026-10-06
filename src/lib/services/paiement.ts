import api from '../api'

export const paiementService = {
  /**
   * Initie un paiement GeniusPay et retourne l'URL de checkout.
   * Le frontend doit rediriger le client vers `data.checkoutUrl`.
   */
  initierGeniusPay(data: {
    montant: number
    description?: string
    nom?: string
    email?: string
    telephone?: string
    metadata?: Record<string, string | number>
  }) {
    return api.post('/paiement/geniuspay/initier', data)
  },

  /**
   * Vérifie le statut d'un paiement GeniusPay via sa référence (MTX-...).
   * Statuts possibles : pending, processing, completed, failed, cancelled, refunded.
   */
  verifierGeniusPay(reference: string) {
    return api.get(`/paiement/geniuspay/statut/${reference}`)
  },
}
