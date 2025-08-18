"use client"
import { useEffect } from "react"
import { LuX } from "react-icons/lu"

interface InfoModalProps {
    isOpen: boolean
    onClose: () => void
}

export const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="max-h-[70dvh] overflow-y-auto relative bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-3xl w-full mx-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Chat con IA generativa</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <LuX className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 text-gray-300">
                    <p>Prueba técnica para desarrollador Fullstack</p>
                    <p className="text-white">Descripción:</p>
                    <p>
                        Desarrollar una aplicación web que permita a los usuarios interactuar 
                        con una IA generativa a través de un área de texto similar a un chat. 
                        Los usuarios escribirán un párrafo explicando una situación, y la IA 
                        deberá responder con un JSON que identifique las siguientes variables clave:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Date: La fecha del suceso en formato yyyy-mm-dd. </li>
                        <li>Location: El lugar donde ocurrió el suceso (puede ser una dirección o &quot;domicilio titular&quot;). </li>
                        <li>Description: Una breve descripción de lo sucedido en una sola oración. </li>
                        <li>Injuries: Indicar si hay heridos (true o false). </li>
                        <li>Owner: Indicar si el usuario es el titular del objeto protagonista del hecho (true o false). </li>
                        <li>Complete: Indicar si toda la información necesaria ha sido proporcionada (true o false). </li>
                        <li>Question: Si complete es false, incluir una pregunta para obtener la información faltante. Si complete es true, question será un string vacío. </li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

