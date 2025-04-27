"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppState } from "@/contexts/app-state-context"

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { userSettings } = useAppState()

  // Apply theme settings whenever they change
  useEffect(() => {
    // Apply dark/light mode
    if (userSettings.appearance.darkMode) {
      document.documentElement.classList.add("dark")
      document.body.classList.add("bg-[#121212]")
      document.body.classList.add("text-[#F2F2F2]")
    } else {
      document.documentElement.classList.remove("dark")
      document.body.classList.remove("bg-[#121212]")
      document.body.classList.remove("text-[#F2F2F2]")
      document.body.classList.add("bg-[#F5F5F5]")
      document.body.classList.add("text-[#121212]")
    }

    // Apply theme color (could be expanded with more themes)
    if (userSettings.appearance.theme === "purple") {
      document.documentElement.style.setProperty("--primary", "270 80% 70%")
    } else if (userSettings.appearance.theme === "green") {
      document.documentElement.style.setProperty("--primary", "120 80% 70%")
    } else if (userSettings.appearance.theme === "orange") {
      document.documentElement.style.setProperty("--primary", "30 80% 70%")
    } else {
      document.documentElement.style.setProperty("--primary", "240 80% 70%")
    }

    return () => {
      // Cleanup if needed
    }
  }, [userSettings.appearance])

  return <>{children}</>
}
