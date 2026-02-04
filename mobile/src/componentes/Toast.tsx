// ========================================
// TOAST MESSAGE COMPONENT
// ========================================
// Mensagens não-bloqueantes para feedback

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

const TOAST_CONFIG = {
    success: { icon: 'checkmark-circle', bg: '#34C759', color: '#FFFFFF' },
    error: { icon: 'close-circle', bg: '#FF3B30', color: '#FFFFFF' },
    info: { icon: 'information-circle', bg: '#007AFF', color: '#FFFFFF' },
    warning: { icon: 'warning', bg: '#FF9500', color: '#FFFFFF' },
};

function ToastItem({ toast, onHide }: { toast: Toast; onHide: () => void }) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const config = TOAST_CONFIG[toast.type];

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2500),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onHide());
    }, []);

    return (
        <Animated.View
            style={[
                estilos.toast,
                { backgroundColor: config.bg, transform: [{ translateY }] },
            ]}
        >
            <Ionicons name={config.icon as any} size={22} color={config.color} />
            <Text style={[estilos.toastTexto, { color: config.color }]}>
                {toast.message}
            </Text>
        </Animated.View>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={estilos.container} pointerEvents="none">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onHide={() => hideToast(toast.id)}
                    />
                ))}
            </View>
        </ToastContext.Provider>
    );
}

const estilos = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 8,
        width: width - 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    toastTexto: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
});
