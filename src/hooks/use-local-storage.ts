"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue) // valores
    const [isLoaded, setIsLoaded] = useState(false) // estado de carga

    // cargar valores al inicio:
    useEffect(() => {
        try {
            // asegurar estar en el cliente.
            if (typeof window !== "undefined") {
                const item = window.localStorage.getItem(key)
                if (item) {
                    setStoredValue(JSON.parse(item))
                }
            }
        } catch (error) {
            console.error(`Error al cargar valor del localStorage - "${key}":`, error)
        } finally {
            setIsLoaded(true)
        }
    }, [key])

    // misma funcion que el useState pero que guarda el valor al local storage:
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)

            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
        console.error(`Error guardando valor al localStorage "${key}":`, error)
        }
    }

    // para remover del local storage
    const removeValue = () => {
        try {
        setStoredValue(initialValue)
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(key)
        }
        } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error)
        }
    }

    return [storedValue, setValue, removeValue, isLoaded] as const
}
