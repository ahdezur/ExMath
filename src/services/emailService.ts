import { EMAIL_CONFIG } from '../config/emailConfig';

export interface SendOTPParams {
  toEmail: string;
  recipientName: string;
  code: string;
  universityName: string;
}

export interface SendOTPResult {
  success: boolean;
  message?: string;
  providerUsed?: string;
}

/**
 * Plantilla HTML formal en Español con logo ∑ ExMath y código OTP
 */
export function generateOTPEmailHTML(recipientName: string, code: string, universityName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Verificación ExMath</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 36px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Encabezado con Logo del Proyecto -->
          <div style="text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 24px;">
            <div style="display: inline-block; width: 52px; height: 52px; line-height: 52px; background: linear-gradient(135deg, #0891b2, #2563eb); color: #ffffff; font-size: 28px; font-weight: 900; border-radius: 16px; font-family: serif; text-align: center; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.25);">
              ∑
            </div>
            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 12px 0 2px 0; tracking-tight: -0.02em;">ExMath</h1>
            <p style="font-size: 11px; font-weight: 800; color: #0891b2; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
              Plataforma Interactiva de Matemáticas • ${universityName}
            </p>
          </div>

          <!-- Mensaje Principal -->
          <div style="font-size: 15px; line-height: 1.6; color: #334155;">
            <p style="margin-top: 0;">Estimado/a <strong>${recipientName}</strong>,</p>
            <p>Se ha solicitado un código de verificación para acceder a los cursos y certámenes matemáticos de <strong>${universityName}</strong>.</p>
            
            <!-- Caja Destacada con el Código OTP de 6 dígitos -->
            <div style="background-color: #ecfeff; border: 2px dashed #06b6d4; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
              <span style="display: block; font-size: 11px; font-weight: 800; uppercase; color: #0e7490; letter-spacing: 0.08em; margin-bottom: 8px;">CÓDIGO DE VERIFICACIÓN (OTP)</span>
              <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0891b2; display: inline-block;">
                ${code}
              </span>
              <span style="display: block; font-size: 12px; font-weight: 700; color: #0e7490; margin-top: 12px;">
                ⏱ Válido únicamente por los próximos 5 minutos
              </span>
            </div>

            <p style="font-size: 13px; color: #64748b;">Ingresa estos 6 dígitos en la plataforma ExMath para confirmar tu acceso.</p>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
          </div>

          <!-- Pie de página -->
          <div style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 28px;">
            <p style="margin: 0;">© ExMath • Sistema de Autenticación Institucional Estudiantil</p>
          </div>

        </div>
      </body>
    </html>
  `;
}

/**
 * Envía el correo OTP real a la casilla del estudiante usando el proveedor configurado
 */
export async function sendOTPEmail({
  toEmail,
  recipientName,
  code,
  universityName,
}: SendOTPParams): Promise<SendOTPResult> {
  const subject = `Código de Verificación ExMath: ${code}`;
  const htmlContent = generateOTPEmailHTML(recipientName, code, universityName);

  // 1. Intentar con Brevo API (Si el proveedor es 'brevo' o hay API Key de Brevo)
  if (EMAIL_CONFIG.provider === 'brevo' || (EMAIL_CONFIG.brevo.apiKey && !EMAIL_CONFIG.resend.apiKey)) {
    if (EMAIL_CONFIG.brevo.apiKey) {
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': EMAIL_CONFIG.brevo.apiKey,
          },
          body: JSON.stringify({
            sender: { name: EMAIL_CONFIG.brevo.senderName, email: EMAIL_CONFIG.brevo.senderEmail },
            to: [{ email: toEmail, name: recipientName }],
            subject: subject,
            htmlContent: htmlContent,
          }),
        });

        if (response.ok) {
          return { success: true, providerUsed: 'brevo' };
        } else {
          const errorData = await response.json();
          console.warn('Error en Brevo API:', errorData);
          return {
            success: false,
            providerUsed: 'brevo',
            message: errorData.message || 'Error al enviar por Brevo API.',
          };
        }
      } catch (err) {
        console.warn('Excepción conectando a Brevo API:', err);
      }
    }
  }

  // 2. Intentar con Resend API
  if (EMAIL_CONFIG.resend.apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EMAIL_CONFIG.resend.apiKey}`,
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.resend.fromEmail,
          to: [toEmail],
          subject: subject,
          html: htmlContent,
        }),
      });

      if (response.ok) {
        return { success: true, providerUsed: 'resend' };
      } else {
        const errorData = await response.json();
        console.warn('Error en Resend API:', errorData);
        if (EMAIL_CONFIG.provider === 'resend') {
          return {
            success: false,
            providerUsed: 'resend',
            message: errorData.message || 'Error al enviar por Resend API.',
          };
        }
      }
    } catch (err) {
      console.warn('Excepción conectando a Resend API:', err);
    }
  }

  // 3. Intentar con EmailJS API
  if (EMAIL_CONFIG.emailjs.serviceId && EMAIL_CONFIG.emailjs.publicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAIL_CONFIG.emailjs.serviceId,
          template_id: EMAIL_CONFIG.emailjs.templateId,
          user_id: EMAIL_CONFIG.emailjs.publicKey,
          template_params: {
            to_email: toEmail,
            to_name: recipientName,
            otp_code: code,
            university: universityName,
          },
        }),
      });

      if (response.ok) {
        return { success: true, providerUsed: 'emailjs' };
      }
    } catch (err) {
      console.warn('Excepción EmailJS API:', err);
    }
  }

  // 4. Intentar con Webhook Personalizado
  if (EMAIL_CONFIG.webhook.endpoint) {
    try {
      const response = await fetch(EMAIL_CONFIG.webhook.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail, recipientName, code, universityName, htmlContent }),
      });
      if (response.ok) {
        return { success: true, providerUsed: 'webhook' };
      }
    } catch (err) {
      console.warn('Error en Webhook de correo:', err);
    }
  }

  // Si no hay API Key configurada aún:
  console.info(`[ExMath Dev OTP] Código de Verificación para ${toEmail}: ${code}`);
  return {
    success: false,
    message: `Código generado: ${code}. Configura VITE_RESEND_API_KEY o VITE_BREVO_API_KEY para enviar emails automáticos reales.`,
  };
}
