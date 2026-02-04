// ========================================
// SERVIÇO DE NOTIFICAÇÕES
// ========================================
// Push notifications com Expo

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configuração de como as notificações são exibidas no foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Registrar para push notifications e obter token
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    // Push funciona apenas em dispositivos físicos
    if (!Device.isDevice) {
        console.log('Push notifications requerem dispositivo físico');
        return null;
    }

    // Verificar permissões existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Se não tem permissão, solicitar
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Permissão para notificações não foi concedida');
        return null;
    }

    try {
        // Obter Expo Push Token
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const pushToken = await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
        });
        token = pushToken.data;
    } catch (error) {
        console.log('Erro ao obter push token:', error);
    }

    // Configuração específica Android
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#007AFF',
        });
    }

    return token;
}

// Enviar notificação local
export async function sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: data || {},
            sound: true,
        },
        trigger: null, // Imediato
    });
}

// Adicionar listener para notificações recebidas
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
) {
    return Notifications.addNotificationReceivedListener(callback);
}

// Adicionar listener para resposta a notificações
export function addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

// Cancelar todas as notificações
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
