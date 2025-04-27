"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from "lucide-react"
import { holidayIcons, getAllCategories, getIconsByCategory, searchIcons } from "@/lib/holiday-icons"

interface HolidayIconSelectorProps {
  selectedIcon: string
  onSelectIcon: (iconName: string) => void
}

export function HolidayIconSelector({ selectedIcon, onSelectIcon }: HolidayIconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const categories = ["all", ...getAllCategories()]

  // Filter icons based on search query and selected category
  const filteredIcons = searchQuery
    ? searchIcons(searchQuery)
    : activeTab === "all"
      ? holidayIcons
      : getIconsByCategory(activeTab)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setSearchQuery("")}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full" orientation="horizontal">
          <TabsList className="w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value={activeTab} className="mt-4">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-5 gap-2 p-1">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.icon
                return (
                  <Button
                    key={icon.name}
                    variant={selectedIcon === icon.name ? "default" : "outline"}
                    size="icon"
                    className="h-12 w-12 rounded-md flex flex-col items-center justify-center"
                    onClick={() => onSelectIcon(icon.name)}
                    title={icon.name}
                  >
                    <IconComponent size={24} />
                  </Button>
                )
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-5 py-8 text-center text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No icons found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
