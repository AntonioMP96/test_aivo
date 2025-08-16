"use client"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">About AI Chat Interface</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-card-foreground">
          <p className="text-sm leading-relaxed">
            This AI Chat Interface allows you to interact with AI models and see both the formatted response and the raw
            JSON data returned by the API.
          </p>

          <div className="space-y-2">
            <h3 className="font-medium">Features:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Large input area for detailed questions</li>
              <li>• Side-by-side AI response and JSON output</li>
              <li>• Dark/Light theme toggle</li>
              <li>• Copy-to-clipboard functionality</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Built with Next.js, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
