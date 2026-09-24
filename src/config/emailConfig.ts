/**
 * Configuración del Servicio de Envío de Correos Electrónicos OTP para ExMath
 * 
 * Configura tus llaves API a través de variables de entorno (.env.local):
 * VITE_EMAIL_PROVIDER=brevo
 * VITE_BREVO_API_KEY=tu_api_key
 * VITE_BREVO_SENDER_EMAIL=tu_correo
 */

const metaEnv = (import.meta as any).env || {};

export const EMAIL_CONFIG = {
  // Proveedor activo ('brevo' | 'resend' | 'emailjs' | 'webhook')
  provider: (metaEnv.VITE_EMAIL_PROVIDER as string) || 'brevo',

  // Configuración de Resend (https://resend.com)
  resend: {
    apiKey: (metaEnv.VITE_RESEND_API_KEY as string) || '',
    fromEmail: (metaEnv.VITE_RESEND_FROM as string) || 'ExMath <contacto@alvaroprofemate.cl>',
  },

  // Configuración de Brevo / Sendinblue (https://brevo.com)
  brevo: {
    apiKey: (metaEnv.VITE_BREVO_API_KEY as string) || '',
    senderEmail: (metaEnv.VITE_BREVO_SENDER_EMAIL as string) || 'alvarohernandez345@gmail.com',
    senderName: 'ExMath Matemáticas',
  },

  // Configuración de EmailJS (https://emailjs.com)
  emailjs: {
    serviceId: (metaEnv.VITE_EMAILJS_SERVICE_ID as string) || '',
    templateId: (metaEnv.VITE_EMAILJS_TEMPLATE_ID as string) || '',
    publicKey: (metaEnv.VITE_EMAILJS_PUBLIC_KEY as string) || '',
  },

  // Webhook personalizado o Backend API
  webhook: {
    endpoint: (metaEnv.VITE_EMAIL_WEBHOOK_URL as string) || '',
  },
};
