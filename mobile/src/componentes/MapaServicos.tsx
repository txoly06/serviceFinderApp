// ========================================
// COMPONENTE DE MAPA
// ========================================
// Mapa interativo mostrando prestadores próximos
// Suporta Apple Maps (iOS), Google Maps (Android) e Tiles customizados (Mapbox/OSM)

import React from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Configuração do Mapbox (Opcional)
// Substitua SEU_TOKEN_AQUI pelo seu token público do Mapbox se desejar usar
const MAPBOX_TOKEN = 'pk.eyJ1IjoidHhvbHkwNiIsImEiOiJjbWw0enh6NG0wMWQ3M2VzaTQ5cTd0emh1In0.bnQHTfyS3KhTZ55IlOA-Tw';
const USE_MAPBOX = true; // Mude para true após colocar o token

interface ServicoMapa {
    id: string;
    titulo: string;
    categoria: string;
    lat: number;
    lng: number;
    preco: string;
}

interface MapaProps {
    servicos: ServicoMapa[];
    aoSelecionar: (id: string) => void;
}

export function MapaServicos({ servicos, aoSelecionar }: MapaProps) {
    // Coordenada inicial (Luanda, Angola como padrão)
    const initialRegion = {
        latitude: -8.839988,
        longitude: 13.289437,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={estilos.container}>
            <MapView
                style={estilos.mapa}
                initialRegion={initialRegion}
                provider={PROVIDER_DEFAULT}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* Camada de Tiles do Mapbox (se ativado) */}
                {USE_MAPBOX && (
                    <UrlTile
                        urlTemplate={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
                        zIndex={-1}
                    />
                )}

                {/* Marcadores dos Serviços */}
                {servicos.map(servico => (
                    <Marker
                        key={servico.id}
                        coordinate={{
                            latitude: servico.lat,
                            longitude: servico.lng
                        }}
                        title={servico.titulo}
                        description={`${servico.categoria} - ${servico.preco}`}
                        onCalloutPress={() => aoSelecionar(servico.id)}
                    >
                        <View style={estilos.markerContainer}>
                            <View style={estilos.markerBarrow}>
                                <Ionicons name="construct" size={16} color="#FFFFFF" />
                            </View>
                            <View style={estilos.markerArrow} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {!USE_MAPBOX && (
                <View style={estilos.aviso}>
                    <Text style={estilos.avisoTexto}>
                        Para ver o mapa detalhado, configure um provedor de mapas.
                    </Text>
                </View>
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        height: 250,
        width: width - 32,
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginBottom: 24,
        alignSelf: 'center',
        backgroundColor: '#F0F0F0',
    },
    mapa: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerBarrow: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 0,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#007AFF',
        transform: [{ translateY: -2 }],
    },
    aviso: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 8,
    },
    avisoTexto: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    }
});
