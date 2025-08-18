"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { ChatMessage } from "@/app/page"
import { getAIResponse } from "@/actions/get-ai-response"

interface ChatInterfaceProps {
  currentMessage: ChatMessage | null
  onNewMessage: (message: ChatMessage) => void
  onAskAgain: () => void
}


export const ChatInterface = ({ currentMessage, onNewMessage, onAskAgain }: ChatInterfaceProps) => {
    const [question, setQuestion] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [followUpAnswer, setFollowUpAnswer] = useState("")
    const [isFollowUpLoading, setIsFollowUpLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const followUpRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        // para mover el focus:
        if (!currentMessage && textareaRef.current) {
            textareaRef.current.focus()
        }
        if (currentMessage?.pendingFollowUp && followUpRef.current) {
            followUpRef.current.focus()
        }
    }, [currentMessage])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // se puede usar ctrl o cmd + enter para enviar el mensaje
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !currentMessage && question.trim()) {
                e.preventDefault()
                handleSubmit(e as unknown as React.FormEvent )
            }
            // al presionar esc se borra el input del usuario
            if (e.key === "Escape" && !currentMessage) {
                setQuestion("")
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [question, currentMessage])

    // enviar primer situacion a la IA:
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!question.trim() || isLoading) return

        setIsLoading(true)

        try {
            // Respuesta de la IA:
            const now = new Date().toLocaleDateString();
            const aiResponse = await getAIResponse({ userQuestion: question, clientTime: now });
            if (!aiResponse.ok || !aiResponse.response) {
                throw new Error(aiResponse.message);
            }

            const newMessage: ChatMessage = {
                id: crypto.randomUUID(),
                question: question.trim(),
                answer: aiResponse.response.readable,
                jsonResponse: JSON.stringify(aiResponse.response.jsonresponse, null, 2),
                timestamp: Date.now(),
                followUpQuestions: [],
            }

            if (!aiResponse.response.jsonresponse.complete && aiResponse.response.jsonresponse.question) {
                newMessage.pendingFollowUp = {
                    question: aiResponse.response.jsonresponse.question,
                    timestamp: Date.now(),
                }
            }

            onNewMessage(newMessage)
            setQuestion("")
        } catch (error) {
            console.error("Error generando respuesta:", error)
            setError("Error obteniendo respuesta. Vuelva a cargar la página e intente de nuevo en unos instantes.")
        } finally {
            setIsLoading(false)
        }
    }

    // enviando respuestas a preguntas de seguimiento:
    const handleFollowUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!followUpAnswer.trim() || !currentMessage?.pendingFollowUp || isFollowUpLoading) return

        setIsFollowUpLoading(true)
        // console.log('Mensaje actual:', currentMessage)

        try {
            const now = new Date().toLocaleDateString();
            const aiResponse = await getAIResponse({ 
                userQuestion: currentMessage.question, 
                clientTime: now,
                followUpAnswer: followUpAnswer,
                followUpData: currentMessage.followUpQuestions
            });
            if (!aiResponse.ok || !aiResponse.response) {
                throw new Error(aiResponse.message);
            }

            const followUpResponse = {
                id: crypto.randomUUID(),
                question: followUpAnswer.trim(),
                answer: aiResponse.response.readable,
                jsonResponse: JSON.stringify(aiResponse.response.jsonresponse, null, 2),
                timestamp: Date.now(),
            }

            const updatedMessage: ChatMessage = {
                ...currentMessage,
                followUpQuestions: [...(currentMessage.followUpQuestions || []), followUpResponse],
                pendingFollowUp: undefined, // limpiar pendientes
            }

            if (!aiResponse.response.jsonresponse.complete && aiResponse.response.jsonresponse.question) {
                updatedMessage.pendingFollowUp = {
                question: aiResponse.response.jsonresponse.question,
                timestamp: Date.now(),
                }
            }

            onNewMessage(updatedMessage)
            setFollowUpAnswer("")
        } catch (error) {
            console.error("Error generando respuesta:", error)
            setError("Error obteniendo respuesta. Vuelva a cargar la página e intente de nuevo en unos instantes.")
        } finally {
            setIsFollowUpLoading(false)
        }
    }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
    {/* Input / Display de la situacion */}
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Describe tu situación</h2>

        {error &&
        <div className="p-6 bg-red-950 border border-red-700 rounded-lg h-fit">
            <div className="prose prose-sm max-w-none prose-invert">
            <p className="text-red-500 leading-relaxed">
                {error}
            </p>
            </div>
        </div>
        }

        {currentMessage ? (
        // En modo display, se muestra el texto solamente
        <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="font-medium text-sm text-gray-400 mb-2">Tu situación:</p>
                <p className="text-white">{currentMessage.question}</p>
            </div>

            {currentMessage.followUpQuestions && currentMessage.followUpQuestions.length > 0 && (
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Conversación Completa</h3>
                {currentMessage.followUpQuestions.map((followUp, index) => (
                    <div key={followUp.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <p className="font-medium text-sm text-gray-400 mb-2">Seguimiento {index + 1}:</p>
                        <p className="text-white mb-3">{followUp.question}</p>
                        <p className="font-medium text-sm text-gray-400 mb-2">Respuesta:</p>
                        <p className="text-white">{followUp.answer}</p>
                    </div>
                ))}
            </div>
            )}

            <button
            onClick={onAskAgain}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            Describir otra situación
            </button>
        </div>
        ) : (
        // En modo input se muestra un textarea
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
            <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Describe aquí tu situación... (Ctrl+Enter para enviar)"
                className="w-full min-h-[120px] p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white"
                disabled={isLoading}
                maxLength={2000}
            />
            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Presiona Ctrl+Enter para enviar, Escape para limpiar</span>
                <span>{question.length}/2000</span>
            </div>
            </div>
            <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            {isLoading ? "Pensando..." : "Enviar Pregunta"}
            </button>
        </form>
        )}
    </div>

    {currentMessage?.pendingFollowUp && (
        <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Pregunta de Seguimiento</h2>
        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="font-medium text-sm text-blue-400 mb-2">La IA pregunta:</p>
            <p className="text-white">{currentMessage.pendingFollowUp.question}</p>
        </div>

        <form onSubmit={handleFollowUpSubmit} className="space-y-4">
            <div className="space-y-2">
            <textarea
                ref={followUpRef}
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full min-h-[100px] p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white"
                disabled={isFollowUpLoading}
                maxLength={1000}
            />
            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Responde a la pregunta de seguimiento</span>
                <span>{followUpAnswer.length}/1000</span>
            </div>
            </div>
            <button
            type="submit"
            disabled={!followUpAnswer.trim() || isFollowUpLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
            {isFollowUpLoading ? "Procesando..." : "Enviar Respuesta"}
            </button>
        </form>
        </div>
    )}

    {/* Respuesta: */}
    {(currentMessage || isLoading) && (
        <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Respuesta de la IA</h2>

        {isLoading ? (
            <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-400">La IA está procesando tu pregunta...</p>
            </div>
            </div>
        ) : currentMessage ? (
            <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* respuesta legible */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white">Formato Legible</h3>
                    <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg h-fit">
                        <div className="prose prose-sm max-w-none prose-invert">
                        <p className="text-white leading-relaxed">{currentMessage.answer}</p>
                        </div>
                    </div>
                </div>

                {/* respuesta en formato JSON */}
                <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Formato JSON</h3>
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg h-fit">
                    <pre className="text-sm text-white overflow-x-auto font-mono">
                    <code>{currentMessage.jsonResponse}</code>
                    </pre>
                </div>
                </div>
            </div>

                {currentMessage.followUpQuestions &&
                currentMessage.followUpQuestions.map((followUp, index) => (
                    <div key={followUp.id} className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Respuesta de Seguimiento {index + 1}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="text-md font-medium text-white">Formato Legible</h4>
                                <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg h-fit">
                                    <div className="prose prose-sm max-w-none prose-invert">
                                        <p className="text-white leading-relaxed">{followUp.answer}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-md font-medium text-white">Formato JSON</h4>
                                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg h-fit">
                                    <pre className="text-sm text-white overflow-x-auto font-mono">
                                    <code>{followUp.jsonResponse}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* fecha de la respuesta */}
                <p className="text-xs text-gray-400">
                    Respuesta generada el {new Date(currentMessage.timestamp).toLocaleString()}
                </p>
            </div>
            ) : null}
        </div>
      )}
    </div>
  )
}