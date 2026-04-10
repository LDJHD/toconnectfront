import api from '../api'

export const authService = {
  // Demander un code de vérification (envoyé par email)
  requestCode(email: string) {
    return api.post('/utilisateurs/verifications', { email })
  },
  // Vérifier le code et obtenir un token
  verifyCode(email: string, code: string) {
    return api.post('/verifications/verify-code', { email, code })
  },
}
