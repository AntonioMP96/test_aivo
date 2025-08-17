"use client"

import { LuInfo, LuMenu } from "react-icons/lu"

interface HeaderProps {
  onToggleSidebar: () => void
  onToggleInfoModal: () => void
}

export const Header = ({ onToggleSidebar, onToggleInfoModal }: HeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700 backdrop-blur-sm bg-gray-900/95">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
            <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Alternar barra lateral"
            >
                <LuMenu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">Interfaz de Chat IA</h1>
            </div>

            <button
            onClick={onToggleInfoModal}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Mostrar información"
            >
            <LuInfo className="w-5 h-5" />
            </button>
        </div>
        </header>
    )
}