"use client"

import { useState, useEffect } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Shirt,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Tag,
  Trash2,
  Palette,
} from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

// Define the WardrobeItems type
interface WardrobeItems {
  [category: string]: {
    id: number
    name: string
    brand: string
    tags: string[]
    status: "clean" | "worn"
    imageUrl: string
    colors: { name: string; hex: string }[]
  }[]
}

export default function WardrobePage() {
  // Use global state for wardrobe
  const {
    wardrobeCategories,
    setWardrobeCategories,
    wardrobeItems,
    setWardrobeItems,
    outfits,
    setOutfits,
    availableColors,
    userSettings,
  } = useAppState()

  // State for active tab
  const [activeTab, setActiveTab] = useState("items")

  // State for category navigation
  const [categoryStartIndex, setCategoryStartIndex] = useState(0)
  const maxVisibleCategories = 3

  // State for active category
  const [activeCategory, setActiveCategory] = useState(wardrobeCategories[0]?.id || "")

  // State for new item
  const [newItem, setNewItem] = useState({
    name: "",
    brand: "",
    category: "shirts",
    tags: "",
    status: "clean",
    imageUrl: "",
    colors: [] as { name: string; hex: string }[],
  })

  // State for new category
  const [newCategory, setNewCategory] = useState({
    id: "",
    label: "",
  })

  // State for new outfit
  const [newOutfit, setNewOutfit] = useState({
    name: "",
    occasion: "",
    weather: "",
    items: [] as number[],
  })

  const [currentOutfit, setCurrentOutfit] = useState(0)

  // State for item deletion confirmation
  const [itemToDelete, setItemToDelete] = useState<{ id: number; category: string } | null>(null)

  // State for outfit deletion confirmation
  const [outfitToDelete, setOutfitToDelete] = useState<number | null>(null)

  // State for color selection
  const [showColorSelector, setShowColorSelector] = useState(false)

  // Weather condition from user settings
  const weatherCondition = userSettings.weatherCondition

  // Weather condition icons
  const weatherIcons = {
    sunny: <Sun size={20} className="text-yellow-400" />,
    cloudy: <Cloud size={20} className="text-gray-400" />,
    rainy: <CloudRain size={20} className="text-blue-400" />,
    snowy: <CloudSnow size={20} className="text-blue-200" />,
    windy: <Wind size={20} className="text-gray-400" />,
  }

  // Set active category when categories change
  useEffect(() => {
    // If no active category is set, default to "all"
    if (!activeCategory) {
      setActiveCategory("all")
    }
  }, [wardrobeCategories, activeCategory])

  // Add state for confirmation dialogs
  const [showDeleteItemConfirmation, setShowDeleteItemConfirmation] = useState(false)
  const [showDeleteOutfitConfirmation, setShowDeleteOutfitConfirmation] = useState(false)
  const [showClearWardrobeConfirmation, setShowClearWardrobeConfirmation] = useState(false)

  // Add a clear wardrobe function
  const clearWardrobe = () => {
    // Reset wardrobe items to empty objects for each category
    const emptyWardrobe: WardrobeItems = {}
    wardrobeCategories.forEach((category) => {
      emptyWardrobe[category.id] = []
    })

    setWardrobeItems(emptyWardrobe)
    setOutfits([]) // Also clear outfits since they reference items
    setShowClearWardrobeConfirmation(false)
  }

  // Add new item
  const addItem = () => {
    if (newItem.name.trim() === "" || newItem.brand.trim() === "") {
      return
    }

    const category = newItem.category
    const newId =
      Math.max(
        0,
        ...Object.values(wardrobeItems)
          .flat()
          .map((item) => item.id),
      ) + 1
    const tags = newItem.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    const newItemObj = {
      id: newId,
      name: newItem.name,
      brand: newItem.brand,
      tags,
      colors: newItem.colors,
      status: newItem.status as "clean" | "worn",
      imageUrl:
        newItem.imageUrl || `https://placeholder.svg?height=300&width=300&text=${encodeURIComponent(newItem.name)}`,
    }

    setWardrobeItems({
      ...wardrobeItems,
      [category]: [...(wardrobeItems[category] || []), newItemObj],
    })

    setNewItem({
      name: "",
      brand: "",
      category: "shirts",
      tags: "",
      status: "clean",
      imageUrl: "",
      colors: [],
    })
  }

  // Add new category
  const addCategory = () => {
    if (newCategory.id.trim() === "" || newCategory.label.trim() === "") {
      return
    }

    const categoryId = newCategory.id.toLowerCase().replace(/\s+/g, "-")

    setWardrobeCategories([...wardrobeCategories, { id: categoryId, label: newCategory.label }])
    setWardrobeItems({
      ...wardrobeItems,
      [categoryId]: [],
    })

    setNewCategory({
      id: "",
      label: "",
    })
  }

  // Add new outfit
  const addOutfit = () => {
    if (newOutfit.name.trim() === "" || newOutfit.items.length === 0) {
      return
    }

    const newId = Math.max(0, ...outfits.map((o) => o.id)) + 1

    const newOutfitObj = {
      id: newId,
      name: newOutfit.name,
      items: newOutfit.items,
      occasion: newOutfit.occasion || "Everyday",
      weather: newOutfit.weather || "Any",
      rating: 0,
      userCreated: true,
    }

    setOutfits([...outfits, newOutfitObj])

    setNewOutfit({
      name: "",
      occasion: "",
      weather: "",
      items: [],
    })
  }

  // Toggle item status
  const toggleItemStatus = (categoryId: string, itemId: number) => {
    setWardrobeItems({
      ...wardrobeItems,
      [categoryId]: wardrobeItems[categoryId].map((item) => {
        if (item.id === itemId) {
          return { ...item, status: item.status === "clean" ? "worn" : "clean" }
        }
        return item
      }),
    })
  }

  // Delete item
  const confirmDeleteItem = (categoryId: string, itemId: number) => {
    setItemToDelete({ id: itemId, category: categoryId })
    setShowDeleteItemConfirmation(true)
  }

  const deleteItem = () => {
    if (!itemToDelete) return

    const { id, category } = itemToDelete

    setWardrobeItems({
      ...wardrobeItems,
      [category]: wardrobeItems[category].filter((item) => item.id !== id),
    })

    // Also remove this item from any outfits
    setOutfits(
      outfits.map((outfit) => ({
        ...outfit,
        items: outfit.items.filter((itemId) => itemId !== id),
      })),
    )

    setItemToDelete(null)
    setShowDeleteItemConfirmation(false)
  }

  // Delete outfit
  const confirmDeleteOutfit = (outfitId: number) => {
    setOutfitToDelete(outfitId)
    setShowDeleteOutfitConfirmation(true)
  }

  const deleteOutfit = () => {
    if (outfitToDelete === null) return

    setOutfits(outfits.filter((outfit) => outfit.id !== outfitToDelete))
    setOutfitToDelete(null)
    setShowDeleteOutfitConfirmation(false)
  }

  // Navigate outfits
  const nextOutfit = () => {
    setCurrentOutfit((prev) => (prev + 1) % recommendedOutfits.length)
  }

  const prevOutfit = () => {
    setCurrentOutfit((prev) => (prev - 1 + recommendedOutfits.length) % recommendedOutfits.length)
  }

  // Navigate categories
  const nextCategory = () => {
    if (categoryStartIndex + maxVisibleCategories < wardrobeCategories.length) {
      setCategoryStartIndex(categoryStartIndex + 1)
    }
  }

  const prevCategory = () => {
    if (categoryStartIndex > 0) {
      setCategoryStartIndex(categoryStartIndex - 1)
    }
  }

  // Rate outfit
  const rateOutfit = (outfitId: number, rating: number) => {
    setOutfits(
      outfits.map((outfit) => {
        if (outfit.id === outfitId) {
          return { ...outfit, rating }
        }
        return outfit
      }),
    )
  }

  // Toggle color selection for new item
  const toggleColorSelection = (color: (typeof availableColors)[0]) => {
    if (newItem.colors.some((c) => c.name === color.name)) {
      setNewItem({
        ...newItem,
        colors: newItem.colors.filter((c) => c.name !== color.name),
      })
    } else {
      setNewItem({
        ...newItem,
        colors: [...newItem.colors, color],
      })
    }
  }

  // Toggle item selection for new outfit
  const toggleItemSelection = (itemId: number) => {
    if (newOutfit.items.includes(itemId)) {
      setNewOutfit({
        ...newOutfit,
        items: newOutfit.items.filter((id) => id !== itemId),
      })
    } else {
      setNewOutfit({
        ...newOutfit,
        items: [...newOutfit.items, itemId],
      })
    }
  }

  // Get all items as a flat array
  const getAllItems = () => {
    const allItems = []
    for (const [category, items] of Object.entries(wardrobeItems)) {
      items.forEach((item) => {
        allItems.push({
          ...item,
          category,
        })
      })
    }
    return allItems
  }

  // Get clean items as a flat array
  const getCleanItems = () => {
    return getAllItems().filter((item) => item.status === "clean")
  }

  // Get item by ID
  const getItemById = (id: number) => {
    return getAllItems().find((item) => item.id === id)
  }

  // Get category for item
  const getCategoryForItem = (itemId: number): string => {
    for (const [category, items] of Object.entries(wardrobeItems)) {
      if (items.some((item) => item.id === itemId)) {
        return category
      }
    }
    return ""
  }

  // Generate outfit recommendations based on weather condition and clean items
  const generateOutfitRecommendations = () => {
    const cleanItems = getCleanItems()

    // Group items by category
    const itemsByCategory: Record<string, any[]> = {}

    cleanItems.forEach((item) => {
      const category = getCategoryForItem(item.id)
      if (!itemsByCategory[category]) {
        itemsByCategory[category] = []
      }
      itemsByCategory[category].push(item)
    })

    // Define weather-appropriate tags
    const weatherTags: Record<string, string[]> = {
      sunny: ["summer", "light", "casual", "cotton", "breathable"],
      cloudy: ["casual", "light", "everyday", "versatile"],
      rainy: ["waterproof", "rain", "water-resistant", "dark"],
      snowy: ["winter", "warm", "thermal", "heavy", "wool"],
      windy: ["windproof", "jacket", "layered", "secure"],
    }

    // Generate outfit recommendations
    const recommendations: any[] = []

    // Try to create 3-4 outfits
    for (let i = 0; i < 4; i++) {
      // Skip if we don't have enough categories
      if (!itemsByCategory.shirts || !itemsByCategory.pants || (!itemsByCategory.shoes && !itemsByCategory.outerwear)) {
        continue
      }

      // Select items with preference for weather-appropriate tags
      const relevantTags = weatherTags[weatherCondition]

      // Helper function to select an item from a category with preference for weather tags
      const selectItem = (category: string, excludeIds: number[] = []) => {
        if (!itemsByCategory[category] || itemsByCategory[category].length === 0) {
          return null
        }

        // First try to find items with relevant tags
        const itemsWithRelevantTags = itemsByCategory[category].filter(
          (item) => !excludeIds.includes(item.id) && item.tags.some((tag) => relevantTags.includes(tag.toLowerCase())),
        )

        if (itemsWithRelevantTags.length > 0) {
          // Select a random item from those with relevant tags
          return itemsWithRelevantTags[Math.floor(Math.random() * itemsWithRelevantTags.length)]
        }

        // If no items with relevant tags, select any item not in excludeIds
        const availableItems = itemsByCategory[category].filter((item) => !excludeIds.includes(item.id))

        if (availableItems.length > 0) {
          return availableItems[Math.floor(Math.random() * availableItems.length)]
        }

        return null
      }

      // Track selected item IDs to avoid duplicates
      const selectedIds: number[] = []

      // Select a shirt
      const shirt = selectItem("shirts", selectedIds)
      if (!shirt) continue
      selectedIds.push(shirt.id)

      // Select pants
      const pants = selectItem("pants", selectedIds)
      if (!pants) continue
      selectedIds.push(pants.id)

      // Select shoes
      const shoes = selectItem("shoes", selectedIds)
      if (shoes) {
        selectedIds.push(shoes.id)
      }

      // Select outerwear if appropriate for the weather
      let outerwear = null
      if (weatherCondition !== "sunny") {
        outerwear = selectItem("outerwear", selectedIds)
        if (outerwear) {
          selectedIds.push(outerwear.id)
        }
      }

      // Select an accessory
      const accessory = selectItem("accessories", selectedIds)
      if (accessory) {
        selectedIds.push(accessory.id)
      }

      // Create outfit name based on weather
      const weatherNames = {
        sunny: "Sunny Day",
        cloudy: "Cloudy Day",
        rainy: "Rainy Day",
        snowy: "Snowy Day",
        windy: "Windy Day",
      }

      const outfitName = `${weatherNames[weatherCondition]} Outfit ${i + 1}`

      // Add outfit to recommendations
      recommendations.push({
        id: -1 - i, // Negative IDs to distinguish from saved outfits
        name: outfitName,
        items: selectedIds,
        occasion: "Everyday",
        weather: weatherCondition,
        rating: 0,
        userCreated: false,
      })
    }

    return recommendations
  }

  // Get recommended outfits based on weather
  const recommendedOutfits = generateOutfitRecommendations()

  // Visible categories based on current index
  const allCategoriesWithAll = [{ id: "all", label: "All" }, ...wardrobeCategories]
  const visibleCategories = allCategoriesWithAll.slice(categoryStartIndex, categoryStartIndex + maxVisibleCategories)

  // State for dialog open
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Wardrobe</h1>
            <div className="flex space-x-3 mt-1 text-xs text-muted-foreground">
              <span>{getAllItems().length} Items</span>
              <span>•</span>
              <span>{outfits.length} Outfits</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setShowClearWardrobeConfirmation(true)}>
              <Trash2 size={16} className="mr-1" /> Clear All
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Tag size={16} className="mr-1" /> Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-id">Category ID</Label>
                    <Input
                      id="category-id"
                      value={newCategory.id}
                      onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                      placeholder="e.g., formal-wear"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-label">Display Name</Label>
                    <Input
                      id="category-label"
                      value={newCategory.label}
                      onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                      placeholder="e.g., Formal Wear"
                    />
                  </div>
                </div>
                <DialogFooter className="space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" /> Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Blue Oxford Shirt"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-brand">Brand</Label>
                    <Input
                      id="item-brand"
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                      placeholder="e.g., H&M"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-category">Category</Label>
                    <select
                      id="item-category"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                      {wardrobeCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-tags">Tags (comma separated)</Label>
                    <Input
                      id="item-tags"
                      value={newItem.tags}
                      onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                      placeholder="e.g., casual, summer, blue"
                    />
                    <p className="text-xs text-muted-foreground">
                      Add weather-related tags like "summer", "winter", "waterproof", etc. for better outfit
                      recommendations
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="item-colors">Colors</Label>
                      <Button variant="outline" size="sm" onClick={() => setShowColorSelector(!showColorSelector)}>
                        <Palette size={16} className="mr-1" />
                        {showColorSelector ? "Hide Colors" : "Select Colors"}
                      </Button>
                    </div>

                    {showColorSelector && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {availableColors.map((color) => (
                          <div key={color.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={`color-${color.name}`}
                              checked={newItem.colors.some((c) => c.name === color.name)}
                              onCheckedChange={() => toggleColorSelection(color)}
                            />
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full mr-1.5" style={{ backgroundColor: color.hex }} />
                              <Label htmlFor={`color-${color.name}`} className="text-sm cursor-pointer">
                                {color.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {newItem.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {newItem.colors.map((color) => (
                          <Badge
                            key={color.name}
                            style={{
                              backgroundColor: color.hex,
                              color: isLightColor(color.hex) ? "#000" : "#fff",
                            }}
                          >
                            {color.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-status">Status</Label>
                    <select
                      id="item-status"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={newItem.status}
                      onChange={(e) => setNewItem({ ...newItem, status: e.target.value as "clean" | "worn" })}
                    >
                      <option value="clean">Clean</option>
                      <option value="worn">Worn</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-image">Image URL</Label>
                    <Input
                      id="item-image"
                      value={newItem.imageUrl}
                      onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a URL to an image on the internet. Leave blank to use a placeholder.
                    </p>
                  </div>
                </div>
                <DialogFooter className="space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Outfit Recommendations */}
        <Card className="gradient-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Sparkles size={18} className="mr-2 text-primary" />
              <h2 className="text-lg font-medium">Outfit Recommendations</h2>
            </div>
          </div>

          <div className="flex items-center mb-3">
            {weatherIcons[weatherCondition]}
            <span className="text-sm ml-2 capitalize">{weatherCondition} Weather</span>
          </div>

          {recommendedOutfits.length > 0 ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                onClick={prevOutfit}
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="px-8">
                <div className="text-center">
                  <h3 className="font-medium">{recommendedOutfits[currentOutfit]?.name || "No outfit available"}</h3>
                  <p className="text-xs text-muted-foreground">Based on your clean wardrobe items</p>

                  <div className="my-4">
                    <ul className="space-y-1 text-sm">
                      {recommendedOutfits[currentOutfit]?.items.map((itemId) => {
                        const item = getItemById(itemId)
                        return item ? (
                          <li key={itemId} className="flex items-center justify-center">
                            {item.name}
                            {item.colors.length > 0 && (
                              <div className="flex ml-2">
                                {item.colors.map((color) => (
                                  <div
                                    key={color.name}
                                    className="w-3 h-3 rounded-full ml-0.5"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            )}
                          </li>
                        ) : null
                      })}
                    </ul>
                  </div>

                  <div className="flex justify-center gap-4 mt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        // Save this recommendation as a user outfit
                        const outfit = recommendedOutfits[currentOutfit]
                        if (outfit) {
                          const newId = Math.max(0, ...outfits.map((o) => o.id)) + 1
                          setOutfits([
                            ...outfits,
                            {
                              ...outfit,
                              id: newId,
                              userCreated: true,
                            },
                          ])
                          // Show confirmation
                          alert("Outfit saved successfully!")
                        }
                      }}
                    >
                      <Plus size={16} className="mr-1" /> Save This Outfit
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                onClick={nextOutfit}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No clean items available for recommendations</p>
              <p className="text-xs text-muted-foreground mt-1">Add more clean items to your wardrobe</p>
            </div>
          )}
        </Card>

        {/* Wardrobe Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="outfits">Outfits</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            {/* Category Navigation with Arrows */}
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevCategory}
                disabled={categoryStartIndex === 0}
                className="flex-shrink-0"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex-grow overflow-hidden">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="w-full flex">
                    {visibleCategories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="flex-1 min-w-0">
                        {category.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextCategory}
                disabled={categoryStartIndex + maxVisibleCategories >= wardrobeCategories.length}
                className="flex-shrink-0"
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Category Content */}
            {activeCategory === "all" ? (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">All Items ({getAllItems().length})</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {getAllItems().map((item) => (
                    <Card key={item.id} className="p-3 relative">
                      <div className="aspect-square bg-secondary/20 rounded-md mb-2 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, replace with placeholder
                              ;(e.target as HTMLImageElement).src =
                                `https://placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name)}`
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shirt size={48} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>

                        {/* Category */}
                        <p className="text-xs text-primary">
                          {wardrobeCategories.find((c) => c.id === item.category)?.label || item.category}
                        </p>

                        {/* Colors */}
                        {item.colors.length > 0 && (
                          <div className="flex mt-1 mb-1">
                            {item.colors.map((color) => (
                              <div
                                key={color.name}
                                className="w-4 h-4 rounded-full mr-1"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="text-xs px-1.5 py-0.5 rounded-full bg-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant={item.status === "clean" ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleItemStatus(item.category, item.id)}
                        >
                          {item.status === "clean" ? "Clean" : "Worn"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => confirmDeleteItem(item.category, item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              wardrobeCategories.map((category) => (
                <div key={category.id} className={activeCategory === category.id ? "block" : "hidden"}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">
                      {category.label} ({wardrobeItems[category.id]?.length || 0} items)
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {wardrobeItems[category.id]?.map((item) => (
                      <Card key={item.id} className="p-3 relative">
                        <div className="aspect-square bg-secondary/20 rounded-md mb-2 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // If image fails to load, replace with placeholder
                                ;(e.target as HTMLImageElement).src =
                                  `https://placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name)}`
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Shirt size={48} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>

                          {/* Colors */}
                          {item.colors.length > 0 && (
                            <div className="flex mt-1 mb-1">
                              {item.colors.map((color) => (
                                <div
                                  key={color.name}
                                  className="w-4 h-4 rounded-full mr-1"
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="text-xs px-1.5 py-0.5 rounded-full bg-secondary">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            variant={item.status === "clean" ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleItemStatus(category.id, item.id)}
                          >
                            {item.status === "clean" ? "Clean" : "Worn"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => confirmDeleteItem(category.id, item.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="outfits">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">My Outfits ({outfits.length})</h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus size={16} className="mr-1" /> Create Outfit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Outfit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="outfit-name">Outfit Name</Label>
                        <Input
                          id="outfit-name"
                          value={newOutfit.name}
                          onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
                          placeholder="e.g., Business Casual"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="outfit-occasion">Occasion</Label>
                        <Input
                          id="outfit-occasion"
                          value={newOutfit.occasion}
                          onChange={(e) => setNewOutfit({ ...newOutfit, occasion: e.target.value })}
                          placeholder="e.g., Work, Casual, Formal"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="outfit-weather">Weather</Label>
                        <select
                          id="outfit-weather"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={newOutfit.weather}
                          onChange={(e) => setNewOutfit({ ...newOutfit, weather: e.target.value })}
                        >
                          <option value="">Select weather condition</option>
                          <option value="sunny">Sunny</option>
                          <option value="cloudy">Cloudy</option>
                          <option value="rainy">Rainy</option>
                          <option value="snowy">Snowy</option>
                          <option value="windy">Windy</option>
                          <option value="Any">Any</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Items</Label>
                        <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto">
                          {wardrobeCategories.map((category) => (
                            <div key={category.id} className="mb-4">
                              <h4 className="font-medium mb-2">{category.label}</h4>
                              <div className="space-y-2">
                                {wardrobeItems[category.id]?.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`item-${item.id}`}
                                      checked={newOutfit.items.includes(item.id)}
                                      onCheckedChange={() => toggleItemSelection(item.id)}
                                    />
                                    <div className="flex items-center">
                                      {item.colors.length > 0 && (
                                        <div className="flex mr-2">
                                          {item.colors.map((color) => (
                                            <div
                                              key={color.name}
                                              className="w-3 h-3 rounded-full ml-0.5"
                                              style={{ backgroundColor: color.hex }}
                                              title={color.name}
                                            />
                                          ))}
                                        </div>
                                      )}
                                      <Label htmlFor={`item-${item.id}`} className="text-sm cursor-pointer">
                                        {item.name}
                                      </Label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {newOutfit.items.length > 0 && (
                        <div className="p-3 border rounded-md bg-secondary/10">
                          <h4 className="font-medium mb-2">Selected Items:</h4>
                          <ul className="space-y-1">
                            {newOutfit.items.map((itemId) => {
                              const item = getItemById(itemId)
                              return (
                                item && (
                                  <li key={itemId} className="flex items-center text-sm">
                                    <span className="mr-2">•</span>
                                    {item.name}
                                    {item.colors.length > 0 && (
                                      <div className="flex ml-2">
                                        {item.colors.map((color) => (
                                          <div
                                            key={color.name}
                                            className="w-3 h-3 rounded-full ml-0.5"
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </li>
                                )
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="space-x-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addOutfit} disabled={newOutfit.name === "" || newOutfit.items.length === 0}>
                        Create Outfit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {outfits.length === 0 ? (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground">You haven't created any outfits yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first outfit to get started!</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {outfits.map((outfit) => (
                    <Card key={outfit.id} className="p-4 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium flex items-center">{outfit.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {outfit.occasion} • {outfit.weather}
                          </p>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => confirmDeleteOutfit(outfit.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <ul className="space-y-1">
                          {outfit.items.map((itemId) => {
                            const item = getItemById(itemId)
                            const category = getCategoryForItem(itemId)
                            return (
                              item && (
                                <li key={itemId} className="flex items-center text-sm">
                                  <span className="text-xs text-muted-foreground mr-2">
                                    {wardrobeCategories.find((c) => c.id === category)?.label}:
                                  </span>
                                  {item.name}
                                  {item.colors.length > 0 && (
                                    <div className="flex ml-2">
                                      {item.colors.map((color) => (
                                        <div
                                          key={color.name}
                                          className="w-3 h-3 rounded-full ml-0.5"
                                          style={{ backgroundColor: color.hex }}
                                          title={color.name}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </li>
                              )
                            )
                          })}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Item Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteItemConfirmation}
        onOpenChange={(open) => {
          setShowDeleteItemConfirmation(open)
          if (!open) setItemToDelete(null)
        }}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={deleteItem}
      />

      {/* Delete Outfit Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteOutfitConfirmation}
        onOpenChange={(open) => {
          setShowDeleteOutfitConfirmation(open)
          if (!open) setOutfitToDelete(null)
        }}
        title="Delete Outfit"
        description="Are you sure you want to delete this outfit? This action cannot be undone."
        onConfirm={deleteOutfit}
      />

      {/* Clear Wardrobe Confirmation Dialog */}
      <ConfirmationDialog
        open={showClearWardrobeConfirmation}
        onOpenChange={setShowClearWardrobeConfirmation}
        title="Clear Entire Wardrobe"
        description="Are you sure you want to delete all items and outfits from your wardrobe? This action cannot be undone."
        onConfirm={clearWardrobe}
        confirmLabel="Yes, Clear Everything"
      />
    </MobileLayout>
  )
}

// Helper function to determine if a color is light or dark
function isLightColor(hex: string) {
  // Convert hex to RGB
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  // Calculate brightness (HSP formula)
  const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  // Return true if color is light
  return brightness > 127.5
}
