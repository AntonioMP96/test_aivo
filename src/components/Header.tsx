"use client"

import { useState } from "react"
import InfoModal from "./InfoModal"

export const  Header = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Chat Interface</h1>
            <p className="text-sm text-muted-foreground">
              Ask questions and see both the AI response and raw JSON data
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Show app information"
            >
              <svg className="w-5 h-5 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

          </div>
        </div>
      </header>

      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  )
}