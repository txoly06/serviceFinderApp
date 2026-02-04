// ========================================
// SKELETON LOADER COMPONENT
// ========================================
// Placeholder animado enquanto carrega dados

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: any;
}

// Componente base de skeleton
export function Skeleton({
    width: w = '100%',
    height = 20,
    borderRadius = 8,
    style
}: SkeletonProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width: w,
                    height,
                    borderRadius,
                    backgroundColor: '#E1E9EE',
                    opacity,
                },
                style,
            ]}
        />
    );
}

// Card de serviço skeleton
export function SkeletonServiceCard() {
    return (
        <View style={estilos.card}>
            {/* Ícone */}
            <Skeleton width={56} height={56} borderRadius={12} />

            {/* Conteúdo */}
            <View style={estilos.conteudo}>
                <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                <Skeleton width="50%" height={14} />
            </View>
        </View>
    );
}

// Lista de skeletons
export function SkeletonList({ count = 5 }: { count?: number }) {
    return (
        <View style={estilos.lista}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonServiceCard key={index} />
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    conteudo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    lista: {
        paddingHorizontal: 24,
    },
});
