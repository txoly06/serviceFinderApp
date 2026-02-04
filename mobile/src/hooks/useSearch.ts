// ========================================
// HOOKS PERSONALIZADOS
// ========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook para debounce de valores
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Chave para armazenamento do histórico
const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_ITEMS = 10;

// Hook para histórico de pesquisa
export function useSearchHistory() {
    const [history, setHistory] = useState<string[]>([]);
    const loadedRef = useRef(false);

    // Carregar histórico ao montar
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        AsyncStorage.getItem(SEARCH_HISTORY_KEY)
            .then(data => {
                if (data) {
                    setHistory(JSON.parse(data));
                }
            })
            .catch(console.log);
    }, []);

    // Adicionar termo ao histórico
    const addToHistory = useCallback(async (term: string) => {
        const trimmed = term.trim();
        if (!trimmed || trimmed.length < 2) return;

        setHistory(prev => {
            // Remove duplicatas e adiciona no início
            const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
            const newHistory = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);

            // Salvar no AsyncStorage
            AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory)).catch(console.log);

            return newHistory;
        });
    }, []);

    // Limpar histórico
    const clearHistory = useCallback(async () => {
        setHistory([]);
        await AsyncStorage.removeItem(SEARCH_HISTORY_KEY).catch(console.log);
    }, []);

    // Remover item específico
    const removeFromHistory = useCallback(async (term: string) => {
        setHistory(prev => {
            const newHistory = prev.filter(item => item !== term);
            AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory)).catch(console.log);
            return newHistory;
        });
    }, []);

    return {
        history,
        addToHistory,
        clearHistory,
        removeFromHistory
    };
}
