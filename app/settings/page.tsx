"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Bell, Moon, ChevronRight, Palette, Type, Calendar, Cloud, Target } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

export default function SettingsPage() {
  const { userSettings, setUserSettings, routines, setRoutines } = useAppState()
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [editAppearanceOpen, setEditAppearanceOpen] = useState(false)
  const [editCalendarOpen, setEditCalendarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showResetRoutinesConfirmation, setShowResetRoutinesConfirmation] = useState(false)

  // Handle profile update
  const handleProfileUpdate = (data: typeof userSettings.profile) => {
    setUserSettings({
      ...userSettings,
      profile: data,
    })
    setEditProfileOpen(false)
  }

  // Handle appearance update
  const handleAppearanceUpdate = (data: typeof userSettings.appearance) => {
    setUserSettings({
      ...userSettings,
      appearance: data,
    })
    setEditAppearanceOpen(false)
  }

  // Handle calendar settings update
  const handleCalendarUpdate = (data: typeof userSettings.calendar) => {
    setUserSettings({
      ...userSettings,
      calendar: data,
    })
    setEditCalendarOpen(false)
  }

  // Handle toggle switches
  const handleToggle = (setting: string, value: boolean) => {
    if (setting === "useDeviceLocation") {
      setUserSettings({
        ...userSettings,
        location: {
          ...userSettings.location,
          useDeviceLocation: value,
        },
      })
    } else if (setting === "temperatureUnit") {
      setUserSettings({
        ...userSettings,
        location: {
          ...userSettings.location,
          temperatureUnit: value ? "celsius" : "fahrenheit",
        },
      })
    } else if (setting === "routineReminders") {
      setUserSettings({
        ...userSettings,
        notifications: {
          ...userSettings.notifications,
          routineReminders: value,
        },
      })
    } else if (setting === "calendarAlerts") {
      setUserSettings({
        ...userSettings,
        notifications: {
          ...userSettings.notifications,
          calendarAlerts: value,
        },
      })
    } else if (setting === "emailNotifications") {
      setUserSettings({
        ...userSettings,
        notifications: {
          ...userSettings.notifications,
          emailNotifications: value,
        },
      })
    }
  }

  // Handle location update
  const handleLocationUpdate = (location: string) => {
    setUserSettings({
      ...userSettings,
      location: {
        ...userSettings.location,
        current: location,
      },
    })
  }

  // Handle email update
  const handleEmailUpdate = (email: string) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        emailAddress: email,
      },
    })
  }

  // Handle avatar selection
  const handleAvatarSelect = () => {
    fileInputRef.current?.click()
  }

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserSettings({
            ...userSettings,
            profile: {
              ...userSettings.profile,
              avatar: event.target.result as string,
            },
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const resetAllRoutines = () => {
    const resetRoutines = routines.map((routine) => ({
      ...routine,
      streak: 0,
      progress: 0,
      lastStreakUpdate: undefined,
      tasks: routine.tasks.map((task) => ({
        ...task,
        completed: false,
        completedDate: undefined,
        locked: false,
      })),
    }))
    setRoutines(resetRoutines)
    setShowResetRoutinesConfirmation(false)
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Settings</h1>
          <Settings size={20} />
        </div>

        {/* Profile Section */}
        <Card className="gradient-card p-4 rounded-xl">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleAvatarSelect}
            >
              {userSettings.profile.avatar ? (
                <img
                  src={userSettings.profile.avatar || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-primary" />
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div>
              <h2 className="text-lg font-medium">{userSettings.profile.name}</h2>
              <p className="text-sm text-muted-foreground">{userSettings.profile.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => setEditProfileOpen(true)}>
            Edit Profile
          </Button>
        </Card>

        {/* Calendar Settings */}
        <Card className="gradient-card-secondary p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
              <Calendar size={18} className="mr-2" /> Calendar
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setEditCalendarOpen(true)}>
              <ChevronRight size={16} />
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Default View:</span>
              <span className="text-primary">
                {userSettings.calendar?.view === "day"
                  ? "Day"
                  : userSettings.calendar?.view === "week"
                    ? "Week"
                    : userSettings.calendar?.view === "year"
                      ? "Year"
                      : "Month"}
              </span>
            </div>
          </div>
        </Card>

        {/* Weather Preferences */}
        <Card className="gradient-card-secondary p-4 rounded-xl">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Cloud size={18} className="mr-2" /> Weather Preferences
          </h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="weather-condition">Default Weather Condition</Label>
              <Select
                value={userSettings.weatherCondition}
                onValueChange={(value: "sunny" | "cloudy" | "rainy" | "snowy" | "windy") => {
                  setUserSettings({
                    ...userSettings,
                    weatherCondition: value,
                  })
                }}
              >
                <SelectTrigger id="weather-condition">
                  <SelectValue placeholder="Select weather condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="snowy">Snowy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                This will be the default weather condition shown on the home page
              </p>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="gradient-card-secondary p-4 rounded-xl">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Bell size={18} className="mr-2" /> Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="routine-reminders" className="cursor-pointer">
                Routine Reminders
              </Label>
              <Switch
                id="routine-reminders"
                checked={userSettings.notifications.routineReminders}
                onCheckedChange={(checked) => handleToggle("routineReminders", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="calendar-alerts" className="cursor-pointer">
                Calendar Alerts
              </Label>
              <Switch
                id="calendar-alerts"
                checked={userSettings.notifications.calendarAlerts}
                onCheckedChange={(checked) => handleToggle("calendarAlerts", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="cursor-pointer">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={userSettings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleToggle("emailNotifications", checked)}
              />
            </div>

            {userSettings.notifications.emailNotifications && (
              <div className="space-y-1 mt-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={userSettings.notifications.emailAddress}
                  onChange={(e) => handleEmailUpdate(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="gradient-card-secondary p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
              <Moon size={18} className="mr-2" /> Appearance
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setEditAppearanceOpen(true)}>
              <ChevronRight size={16} />
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Theme:</span>
              <span className="text-primary">
                {userSettings.appearance.theme === "default"
                  ? "Blue"
                  : userSettings.appearance.theme.charAt(0).toUpperCase() + userSettings.appearance.theme.slice(1)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Dark Mode:</span>
              <span className="text-primary">{userSettings.appearance.darkMode ? "On" : "Off"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Font Size:</span>
              <span className="text-primary">
                {userSettings.appearance.fontSize.charAt(0).toUpperCase() + userSettings.appearance.fontSize.slice(1)}
              </span>
            </div>
          </div>
        </Card>

        {/* Routine Settings */}
        <Card className="gradient-card-secondary p-4 rounded-xl">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Target size={18} className="mr-2" /> Routine Settings
          </h2>
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Reset all routine streaks and task completion status. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={() => setShowResetRoutinesConfirmation(true)} className="w-full">
                Reset All Routines
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={userSettings.profile.name}
                onChange={(e) =>
                  setUserSettings({
                    ...userSettings,
                    profile: {
                      ...userSettings.profile,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={userSettings.profile.email}
                onChange={(e) =>
                  setUserSettings({
                    ...userSettings,
                    profile: {
                      ...userSettings.profile,
                      email: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                  {userSettings.profile.avatar ? (
                    <img
                      src={userSettings.profile.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-primary" />
                  )}
                </div>
                <Button variant="outline" onClick={handleAvatarSelect}>
                  Change Picture
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-initial" onClick={() => handleProfileUpdate(userSettings.profile)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Calendar Settings Dialog */}
      <Dialog open={editCalendarOpen} onOpenChange={setEditCalendarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendar Settings</DialogTitle>
            <DialogDescription>Customize your calendar view</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="calendar-view">Default View</Label>
              <Select
                value={userSettings.calendar?.view || "month"}
                onValueChange={(value: "day" | "week" | "month" | "year") => {
                  setUserSettings({
                    ...userSettings,
                    calendar: {
                      ...userSettings.calendar,
                      view: value,
                    },
                  })
                }}
              >
                <SelectTrigger id="calendar-view">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setEditCalendarOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 sm:flex-initial"
              onClick={() => handleCalendarUpdate(userSettings.calendar || { view: "month" })}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appearance Dialog */}
      <Dialog open={editAppearanceOpen} onOpenChange={setEditAppearanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appearance Settings</DialogTitle>
            <DialogDescription>Customize how the app looks</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="theme-select" className="flex items-center">
                <Palette size={16} className="mr-2" /> Theme
              </Label>
              <Select
                value={userSettings.appearance.theme}
                onValueChange={(value) =>
                  setUserSettings({
                    ...userSettings,
                    appearance: {
                      ...userSettings.appearance,
                      theme: value,
                    },
                  })
                }
              >
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center cursor-pointer">
                  <Moon size={16} className="mr-2" /> Dark Mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={userSettings.appearance.darkMode}
                  onCheckedChange={(checked) =>
                    setUserSettings({
                      ...userSettings,
                      appearance: {
                        ...userSettings.appearance,
                        darkMode: checked,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size" className="flex items-center">
                <Type size={16} className="mr-2" /> Font Size
              </Label>
              <Select
                value={userSettings.appearance.fontSize}
                onValueChange={(value: "small" | "medium" | "large") =>
                  setUserSettings({
                    ...userSettings,
                    appearance: {
                      ...userSettings.appearance,
                      fontSize: value,
                    },
                  })
                }
              >
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setEditAppearanceOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-initial" onClick={() => handleAppearanceUpdate(userSettings.appearance)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Routines Confirmation Dialog */}
      <ConfirmationDialog
        open={showResetRoutinesConfirmation}
        onOpenChange={setShowResetRoutinesConfirmation}
        title="Reset All Routines"
        description="Are you sure you want to reset all routine streaks and task completion status? This action cannot be undone."
        onConfirm={resetAllRoutines}
        confirmLabel="Yes, Reset All"
        cancelLabel="Cancel"
      />
    </MobileLayout>
  )
}
