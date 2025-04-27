"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Calendar, Home, Shirt, Repeat, Settings } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname()
  const { userSettings } = useAppState()

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Repeat, label: "Routines", href: "/routines" },
    { icon: Shirt, label: "Wardrobe", href: "/wardrobe" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  // Apply font size from settings
  const getFontSizeClass = () => {
    switch (userSettings.appearance.fontSize) {
      case "small":
        return "text-sm"
      case "large":
        return "text-lg"
      default:
        return "text-base"
    }
  }

  return (
    <div className={`flex flex-col h-[100svh] w-full max-w-md mx-auto overflow-hidden ${getFontSizeClass()}`}>
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1A1A1A] border-t border-[#2A2A2A] h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 h-full ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
