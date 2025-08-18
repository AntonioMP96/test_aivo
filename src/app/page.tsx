"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { InfoModal } from "@/components/InfoModal"
import { Sidebar } from "@/components/Sidebar"
import { ChatInterface } from "@/components/ChatInterface"
import { useLocalStorage } from "@/hooks/use-local-storage"

export interface ChatMessage {
  id: string
  question: string
  answer: string
  jsonResponse: string
  timestamp: number
  followUpQuestions?: Array<{
    id: string
    question: string
    answer: string
    jsonResponse: string
    timestamp: number
  }>
  pendingFollowUp?: {
    question: string
    timestamp: number
  }
}

export default function Page() {
  const [mounted, setMounted] = useState(false) // estado de carga de la pagina
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // estado del menu lateral
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false) // estado del modal informativo
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null) // conversacion que se muestra en pantalla

  const [chatHistory, setChatHistory, clearChatHistory, isHistoryLoaded] = useLocalStorage<ChatMessage[]>(
    "chatHistory",
    [],
  )

  useEffect(() => {
    setMounted(true) // colocar estado de carga
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleInfoModal = () => setIsInfoModalOpen(!isInfoModalOpen)

  const handleNewMessage = (message: ChatMessage) => {
    if (message.id !== currentMessage?.id) {
      setChatHistory((prev) => [...prev, message]) // agregar nuevo
    } else {
      setChatHistory((prev) => prev.map((msg) => (msg.id === message.id ? message : msg))) // reemplazar si ya existe
    }
    setCurrentMessage(message)
  }

  const handleSelectHistoryItem = (message: ChatMessage) => {
    setCurrentMessage(message)
    setIsSidebarOpen(false)
  }

  const handleAskAgain = () => {
    setCurrentMessage(null)
  }

  const handleClearHistory = () => {
    clearChatHistory()
    setCurrentMessage(null)
    setIsSidebarOpen(false)
  }

  // loader para evitar errores de hidratacion:
  if (!mounted || !isHistoryLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header onToggleSidebar={toggleSidebar} onToggleInfoModal={toggleInfoModal} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={chatHistory}
        onSelectMessage={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />

      <main className="pt-16">
        <ChatInterface currentMessage={currentMessage} onNewMessage={handleNewMessage} onAskAgain={handleAskAgain} />
      </main>
    </div>
  )
}
