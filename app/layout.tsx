import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppStateProvider } from "@/contexts/app-state-context"
import { AppThemeProvider } from "@/components/app-theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Timelink",
  description: "Personal daily assistant",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppStateProvider>
            <AppThemeProvider>{children}</AppThemeProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
