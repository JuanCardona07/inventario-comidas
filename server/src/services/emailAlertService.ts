import nodemailer from 'nodemailer';
import path from 'path';
import type { Ingrediente } from '../types';

const ALERT_STATE_FILE = path.join(__dirname, '../data/alert-state.json');

interface AlertConfig {
  emailService: string;
  emailUser: string;
  emailPass: string;
  emailTo: string;
  threshold: number;
}

class EmailAlertService {
  private transporter: nodemailer.Transporter | null = null;
  private config: AlertConfig | null = null;
  private lastAlertDate: string | null = null;

  initialize(config: AlertConfig) {
    this.config = config;

    if (!config.emailUser || !config.emailPass) {
      console.warn('⚠️ Servicio de alertas por email no configurado');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: config.emailService,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
  }

  async checkAndSendAlerts(ingredientes: Ingrediente[]) {
    if (!this.transporter || !this.config) {
      return;
    }

    // Filtrar ingredientes con stock bajo
    const ingredientesBajos = ingredientes.filter(
      (ing) => ing.cantidad <= ing.minimo
    );

    // No enviar si no hay suficientes ingredientes bajos
    if (ingredientesBajos.length < this.config.threshold) {
      return;
    }

    // Verificar si ya se envió una alerta hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (this.lastAlertDate === hoy) {
      console.log('ℹ️ Ya se envió una alerta hoy');
      return;
    }

    try {
      await this.sendAlert(ingredientesBajos);
      this.lastAlertDate = hoy;
      console.log(`✅ Alerta enviada: ${ingredientesBajos.length} ingredientes bajos`);
    } catch (error) {
      console.error('❌ Error al enviar alerta:', error);
    }
  }

  private async sendAlert(ingredientesBajos: Ingrediente[]) {
    if (!this.transporter || !this.config) return;

    const currency = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    });

    // Generar HTML del email
    const ingredientesHTML = ingredientesBajos
      .map(
        (ing) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-weight: 500;">${ing.nombre}</td>
          <td style="padding: 12px; text-align: center;">
            <span style="color: #dc2626; font-weight: bold;">${ing.cantidad} ${ing.unidad}</span>
          </td>
          <td style="padding: 12px; text-align: center; color: #6b7280;">
            ${ing.minimo} ${ing.unidad}
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="background: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
              ${ing.cantidad - ing.minimo < 0 ? 'CRÍTICO' : 'BAJO'}
            </span>
          </td>
        </tr>
      `
      )
      .join('');

    const mailOptions = {
      from: '"🍔 Kitchify - Sistema de Alertas" <' + this.config.emailUser + '>',
      to: this.config.emailTo,
      subject: `🚨 Alerta de Inventario - ${ingredientesBajos.length} ingrediente${ingredientesBajos.length > 1 ? 's' : ''} con stock bajo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍔 Kitchify</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Sistema de Gestión de Inventario</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
              <h2 style="color: #dc2626; margin: 0 0 8px 0; font-size: 18px;">
                ⚠️ Alerta de Stock Bajo
              </h2>
              <p style="margin: 0; color: #991b1b; font-size: 14px;">
                Se detectaron <strong>${ingredientesBajos.length} ingrediente${ingredientesBajos.length > 1 ? 's' : ''}</strong> con stock por debajo del mínimo requerido.
              </p>
            </div>

            <p style="color: #6b7280; margin-bottom: 20px;">
              Fecha: <strong>${new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</strong>
            </p>

            <h3 style="color: #1f2937; margin-bottom: 16px; font-size: 16px;">Ingredientes que requieren reabastecimiento:</h3>

            <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; font-size: 14px;">Ingrediente</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; font-size: 14px;">Stock Actual</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; font-size: 14px;">Mínimo</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; font-size: 14px;">Estado</th>
                </tr>
              </thead>
              <tbody>
                ${ingredientesHTML}
              </tbody>
            </table>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin-top: 24px; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                💡 <strong>Recomendación:</strong> Realiza el reabastecimiento lo antes posible para evitar interrupciones en la producción.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Este es un mensaje automático del sistema Kitchify.<br>
                No responder a este correo.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Forzar envío de alerta (útil para testing)
  async forceAlert(ingredientes: Ingrediente[]) {
    const ingredientesBajos = ingredientes.filter(
      (ing) => ing.cantidad <= ing.minimo
    );

    if (ingredientesBajos.length === 0) {
      console.log('ℹ️ No hay ingredientes con stock bajo');
      return;
    }

    await this.sendAlert(ingredientesBajos);
    console.log(`✅ Alerta forzada enviada: ${ingredientesBajos.length} ingredientes`);
  }
}

export const emailAlertService = new EmailAlertService();
