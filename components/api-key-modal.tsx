"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function ApiKeyModal() {
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedApiKey = localStorage.getItem("openai_api_key")

    if (!storedApiKey) {
      // If no API key is found, open the modal
      setOpen(true)
    } else {
      // If API key exists, set it in state
      setApiKey(storedApiKey)
    }
  }, [])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      // Save API key to localStorage
      localStorage.setItem("openai_api_key", apiKey)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            To use the AI Assistant, please provide your OpenAI API key. This will be stored locally on your device.
          </p>

          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>You can find your API key in your OpenAI account settings.</p>
            <Link
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline mt-2"
            >
              Get your API key <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Skip for now
          </Button>
          <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
