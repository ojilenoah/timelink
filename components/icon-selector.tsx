"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { routineIcons, getAllCategories, searchIcons, getIconsByCategory } from "@/lib/routine-icons"

interface IconSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIcon: string
  onSelectIcon: (iconName: string) => void
  icons?: any[]
  getIconsByCategory?: (category: string) => any[]
  searchIcons?: (query: string) => any[]
  getAllCategories?: () => string[]
  title?: string
}

export function IconSelector({
  open,
  onOpenChange,
  selectedIcon,
  onSelectIcon,
  icons = routineIcons,
  getIconsByCategory: getIconsByCategoryFn = getIconsByCategory,
  searchIcons: searchIconsFn = searchIcons,
  getAllCategories: getAllCategoriesFn = getAllCategories,
  title = "Select Icon",
}: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredIcons, setFilteredIcons] = useState(icons)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)
  const [isSearchMode, setIsSearchMode] = useState(false)

  const categories = ["All", ...getAllCategoriesFn()]

  // Filter icons based on search query and category
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setIsSearchMode(true)
      setFilteredIcons(searchIconsFn(searchQuery))
    } else {
      setIsSearchMode(false)
      if (activeCategory === "All") {
        setFilteredIcons(icons)
      } else {
        setFilteredIcons(getIconsByCategoryFn(activeCategory))
      }
      setCurrentIconIndex(0)
    }
  }, [searchQuery, activeCategory, icons, getIconsByCategoryFn, searchIconsFn])

  // Navigate to previous icon in category
  const prevIcon = () => {
    if (filteredIcons.length === 0) return
    setCurrentIconIndex((prev) => (prev === 0 ? filteredIcons.length - 1 : prev - 1))
  }

  // Navigate to next icon in category
  const nextIcon = () => {
    if (filteredIcons.length === 0) return
    setCurrentIconIndex((prev) => (prev === filteredIcons.length - 1 ? 0 : prev + 1))
  }

  // Navigate to previous category
  const prevCategory = () => {
    const currentIndex = categories.indexOf(activeCategory)
    const newIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1
    setActiveCategory(categories[newIndex])
  }

  // Navigate to next category
  const nextCategory = () => {
    const currentIndex = categories.indexOf(activeCategory)
    const newIndex = currentIndex === categories.length - 1 ? 0 : currentIndex + 1
    setActiveCategory(categories[newIndex])
  }

  // Get current icon to display
  const currentIcon = filteredIcons.length > 0 ? filteredIcons[currentIconIndex] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!isSearchMode && (
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={prevCategory}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-medium">{activeCategory}</h3>
              <Button variant="outline" size="sm" onClick={nextCategory}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isSearchMode ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filteredIcons.length > 0 ? (
                filteredIcons.map((iconItem) => {
                  const IconComponent = iconItem.icon
                  const isSelected = selectedIcon === iconItem.name

                  return (
                    <Button
                      key={iconItem.name}
                      variant={isSelected ? "default" : "outline"}
                      className="h-20 flex flex-col items-center justify-center gap-2 p-2"
                      onClick={() => onSelectIcon(iconItem.name)}
                    >
                      <IconComponent size={24} className={isSelected ? "text-primary-foreground" : ""} />
                      <span className="text-xs text-center truncate w-full">{iconItem.name}</span>
                    </Button>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No icons found matching "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {currentIcon ? (
                <>
                  <div className="flex items-center justify-between w-full mb-4">
                    <Button variant="ghost" size="icon" onClick={prevIcon}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-lg bg-secondary flex items-center justify-center mb-2">
                        {React.createElement(currentIcon.icon, { size: 40 })}
                      </div>
                      <p className="text-sm font-medium">{currentIcon.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextIcon}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentIconIndex + 1} of {filteredIcons.length}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No icons available</div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (currentIcon && !isSearchMode) {
                onSelectIcon(currentIcon.name)
              }
              onOpenChange(false)
            }}
            disabled={!currentIcon && !isSearchMode}
          >
            Select Icon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
