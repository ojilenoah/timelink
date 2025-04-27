"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { ApiKeyModal } from "./api-key-modal"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const { apiKey, setApiKey } = useAppState()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !apiKey) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...(prev || []), userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          content: "I'm your Timelink assistant. How can I help you organize your day?",
        }
        setMessages((prev) => [...(prev || []), assistantMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key)
    setShowApiKeyModal(false)
  }

  return (
    <div className="flex flex-col h-full">
      {showApiKeyModal && <ApiKeyModal onSubmit={handleApiKeySubmit} onClose={() => setShowApiKeyModal(false)} />}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === "user" ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12"
              }`}
            >
              {message.content}
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Ask me anything about your schedule, routines, or wardrobe!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-h-[60px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !apiKey}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
