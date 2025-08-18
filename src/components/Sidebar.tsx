"use client"

import { useEffect } from "react"
import { LuTrash, LuX } from "react-icons/lu"

interface ChatMessage {
    id: string
    question: string
    answer: string
    jsonResponse: string
    timestamp: number
}

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    chatHistory: ChatMessage[]
    onSelectMessage: (message: ChatMessage) => void
    onClearHistory: () => void
}

export const Sidebar = ({ isOpen, onClose, chatHistory, onSelectMessage, onClearHistory }: SidebarProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, onClose])

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString([], { weekday: "short" })
        } else {
            return date.toLocaleDateString([], { month: "short", day: "numeric" })
        }
    }

    const truncateText = (text: string, maxLength = 50) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    return (
        <>
        {/* backdrop */}
        {isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />}

        {/* sidebar */}
        <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        >
            <div className="flex flex-col h-full">
            {/* header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Historial de Chat</h2>
                <div className="flex items-center gap-2">
                {chatHistory.length > 0 && (
                    <button
                    onClick={onClearHistory}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-300"
                    aria-label="Borrar historial"
                    title="Borrar todo el historial de chat"
                    >
                    <LuTrash className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Cerrar barra lateral"
                >
                    <LuX className="w-5 h-5 text-white" />
                </button>
                </div>
            </div>

            {/* historial de conversaciones */}
            <div className="flex-1 overflow-y-auto">
                {chatHistory.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                    <p>Aún no hay conversaciones</p>
                    <p className="text-sm mt-1">Inicia una conversación para ver tu historial aquí</p>
                </div>
                ) : (
                <div className="p-2">
                    {chatHistory
                    .slice()
                    .reverse()
                    .map((message) => (
                        <button
                        key={message.id}
                        onClick={() => onSelectMessage(message)}
                        className="w-full p-3 mb-2 text-left hover:bg-gray-800 rounded-lg transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm leading-tight">
                                        {truncateText(message.question)}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1 leading-tight">
                                        {truncateText(message.answer, 80)}
                                    </p>
                                </div>
                                <span className="text-gray-500 text-xs whitespace-nowrap">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
                )}
            </div>

            {/* footer del sidebar */}
            <div className="p-4 border-t border-gray-700">
                <p className="text-xs text-gray-400 text-center">
                {chatHistory.length} conversación{chatHistory.length !== 1 ? "es" : ""} guardada
                {chatHistory.length !== 1 ? "s" : ""} localmente
                </p>
            </div>
            </div>
        </div>
        </>
    )
}

