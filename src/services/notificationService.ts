// COALTECH - Multi-Channel Notification Service Abstraction
// Simulated delivery adapter for In-App, SMS (Twilio/Karix), Email (SendGrid), WhatsApp (Gupshup/Twilio API).
// Clearly labeled prototype service.

import type { NotificationItem, SeverityLevel } from '../types';

export interface DispatchNotificationParams {
  title: string;
  message: string;
  severity: SeverityLevel;
  mineId?: string;
  targetUserIds: string[];
  channels: ('in-app' | 'sms' | 'email' | 'voice' | 'whatsapp')[];
}

export async function dispatchMultiChannelNotifications(
  params: DispatchNotificationParams
): Promise<NotificationItem[]> {
  const generated: NotificationItem[] = [];
  const now = new Date().toISOString();

  params.targetUserIds.forEach((userId) => {
    params.channels.forEach((channel) => {
      generated.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId,
        role: 'Target Role',
        mineId: params.mineId,
        title: `[${channel.toUpperCase()}] ${params.title}`,
        message:
          channel === 'voice'
            ? `CoalTech Automated Voice Alert: Urgent attention required. ${params.message}`
            : channel === 'whatsapp'
            ? `*COALTECH STATUTORY ALERT*\n${params.message}\n_Immediate action required._`
            : params.message,
        severity: params.severity,
        timestamp: now,
        read: false,
        channel,
        deliveryStatus: 'Delivered (Simulated)',
      });
    });
  });

  return generated;
}
