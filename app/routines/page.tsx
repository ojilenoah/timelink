"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckCircle2, Circle, Edit, Trash2, Target, X, Lock, Info } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { IconSelector } from "@/components/icon-selector"
import { getIconByName } from "@/lib/routine-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Get next reset date text based on frequency
const getNextResetText = (frequency: string, lastResetDate?: Date) => {
  if (!lastResetDate) return "Not yet started"

  const now = new Date()
  const resetDate = new Date(lastResetDate)

  if (frequency === "daily") {
    // Next day
    resetDate.setDate(resetDate.getDate() + 1)
    return `Resets tomorrow at midnight`
  } else if (frequency === "weekly") {
    // Next week
    resetDate.setDate(resetDate.getDate() + 7)
    return `Resets next ${resetDate.toLocaleDateString("en-US", { weekday: "long" })}`
  } else if (frequency === "monthly") {
    // Next month
    resetDate.setMonth(resetDate.getMonth() + 1)
    return `Resets on ${resetDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
  }

  return "Unknown reset schedule"
}

export default function RoutinesPage() {
  // Use global state for routines
  const { routines, setRoutines, checkAndResetRoutines } = useAppState()

  // State for new routine
  const [newRoutine, setNewRoutine] = useState({
    title: "",
    frequency: "daily",
    goal: "",
    goalPeriod: 30,
    goalUnit: "days" as "days" | "weeks" | "months",
    description: "",
    tasks: [""],
    icon: "Morning Routine",
  })

  // State for editing routine
  const [editingRoutine, setEditingRoutine] = useState<any>(null)

  // State for icon selection
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState("Morning Routine")
  const [isEditingIcon, setIsEditingIcon] = useState(false)

  // State for the new routine dialog
  const [showNewRoutineDialog, setShowNewRoutineDialog] = useState(false)

  // Check for routine resets when the page loads
  useEffect(() => {
    checkAndResetRoutines()
  }, [])

  // Toggle task completion
  const toggleTask = (routineId: number, taskId: number) => {
    setRoutines(
      routines.map((routine) => {
        if (routine.id === routineId) {
          const updatedTasks = routine.tasks.map((task) => {
            if (task.id === taskId) {
              // If task is already completed and locked, don't allow unticking
              if (task.completed && task.locked) {
                return task
              }

              // Otherwise, toggle completion and set locked if completing
              return {
                ...task,
                completed: !task.completed,
                completedDate: !task.completed ? new Date() : undefined,
                locked: !task.completed ? true : false, // Lock when completing, unlock when uncompleting
              }
            }
            return task
          })

          // Calculate progress
          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const progress = Math.round((completedTasks / updatedTasks.length) * 100)

          return { ...routine, tasks: updatedTasks, progress }
        }
        return routine
      }),
    )
  }

  // Add new routine
  const addRoutine = () => {
    if (newRoutine.title.trim() === "" || newRoutine.tasks.some((task) => task.trim() === "")) {
      return
    }

    const newId = Math.max(0, ...routines.map((r) => r.id)) + 1
    const formattedTasks = newRoutine.tasks.map((task, index) => ({
      id: index + 1,
      title: task,
      completed: false,
      locked: false,
    }))

    const newRoutineObj = {
      id: newId,
      title: newRoutine.title,
      icon: selectedIcon,
      streak: 0,
      frequency: newRoutine.frequency,
      goal: newRoutine.goal,
      goalPeriod: newRoutine.goalPeriod,
      goalUnit: newRoutine.goalUnit,
      description: newRoutine.description,
      tasks: formattedTasks,
      progress: 0,
      lastResetDate: new Date(),
    }

    setRoutines([...routines, newRoutineObj])
    setNewRoutine({
      title: "",
      frequency: "daily",
      goal: "",
      goalPeriod: 30,
      goalUnit: "days",
      description: "",
      tasks: [""],
      icon: "Morning Routine",
    })
    setSelectedIcon("Morning Routine")
    setShowNewRoutineDialog(false)
  }

  // Update routine
  const updateRoutine = () => {
    if (!editingRoutine) return

    setRoutines(
      routines.map((routine) => {
        if (routine.id === editingRoutine.id) {
          return editingRoutine
        }
        return routine
      }),
    )

    setEditingRoutine(null)
  }

  // Delete routine
  const deleteRoutine = (id: number) => {
    setRoutines(routines.filter((routine) => routine.id !== id))
    setEditingRoutine(null)
  }

  // Add task field to new routine
  const addTaskField = () => {
    setNewRoutine({ ...newRoutine, tasks: [...newRoutine.tasks, ""] })
  }

  // Update task in new routine
  const updateNewTask = (index: number, value: string) => {
    const updatedTasks = [...newRoutine.tasks]
    updatedTasks[index] = value
    setNewRoutine({ ...newRoutine, tasks: updatedTasks })
  }

  // Add task to editing routine
  const addTaskToEditing = () => {
    if (!editingRoutine) return

    const newTaskId = Math.max(0, ...editingRoutine.tasks.map((t: any) => t.id)) + 1
    setEditingRoutine({
      ...editingRoutine,
      tasks: [...editingRoutine.tasks, { id: newTaskId, title: "", completed: false, locked: false }],
    })
  }

  // Update task in editing routine
  const updateEditingTask = (taskId: number, value: string) => {
    if (!editingRoutine) return

    setEditingRoutine({
      ...editingRoutine,
      tasks: editingRoutine.tasks.map((task: any) => (task.id === taskId ? { ...task, title: value } : task)),
    })
  }

  // Remove task from editing routine
  const removeEditingTask = (taskId: number) => {
    if (!editingRoutine || editingRoutine.tasks.length <= 1) return

    setEditingRoutine({
      ...editingRoutine,
      tasks: editingRoutine.tasks.filter((task: any) => task.id !== taskId),
    })
  }

  // Update goal unit based on frequency
  const updateFrequency = (frequency: string) => {
    let goalUnit: "days" | "weeks" | "months" = "days"
    let goalPeriod = 30

    if (frequency === "daily") {
      goalUnit = "days"
      goalPeriod = 30
    } else if (frequency === "weekly") {
      goalUnit = "weeks"
      goalPeriod = 12
    } else if (frequency === "monthly") {
      goalUnit = "months"
      goalPeriod = 6
    }

    setNewRoutine({
      ...newRoutine,
      frequency,
      goalUnit,
      goalPeriod,
    })
  }

  // Update editing routine frequency and goal unit
  const updateEditingFrequency = (frequency: string) => {
    if (!editingRoutine) return

    let goalUnit: "days" | "weeks" | "months" = "days"
    let goalPeriod = editingRoutine.goalPeriod

    if (frequency === "daily") {
      goalUnit = "days"
      if (!goalPeriod || goalPeriod > 90) goalPeriod = 30
    } else if (frequency === "weekly") {
      goalUnit = "weeks"
      if (!goalPeriod || goalPeriod > 52) goalPeriod = 12
    } else if (frequency === "monthly") {
      goalUnit = "months"
      if (!goalPeriod || goalPeriod > 24) goalPeriod = 6
    }

    setEditingRoutine({
      ...editingRoutine,
      frequency,
      goalUnit,
      goalPeriod,
    })
  }

  // Handle icon selection
  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName)

    if (isEditingIcon && editingRoutine) {
      setEditingRoutine({
        ...editingRoutine,
        icon: iconName,
      })
    }
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Routines</h1>
          <Button size="icon" variant="ghost" onClick={() => setShowNewRoutineDialog(true)}>
            <Plus size={20} />
          </Button>
        </div>

        {/* Weekly Progress */}
        <Card className="gradient-card p-4 rounded-xl">
          <h2 className="text-lg font-medium mb-2">Progress</h2>
          <div className="space-y-4">
            {routines.map((routine) => (
              <div key={routine.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{routine.title}</span>
                  <span>
                    {routine.tasks.filter((task) => task.completed).length}/{routine.tasks.length} tasks
                  </span>
                </div>
                <Progress value={routine.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {routine.streak}{" "}
                    {routine.frequency === "daily" ? "day" : routine.frequency === "weekly" ? "week" : "month"} streak
                    {routine.streak > 0 ? " 🔥" : ""}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help flex items-center">
                          {getNextResetText(routine.frequency, routine.lastResetDate)}
                          <Info size={12} className="ml-1" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tasks will reset and your streak will update at this time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Routines */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Today's Routines</h2>

          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onToggleTask={toggleTask}
              onEdit={(routine) => setEditingRoutine({ ...routine })}
              onDelete={deleteRoutine}
            />
          ))}
        </div>
      </div>

      {/* Add New Routine Dialog */}
      <Dialog open={showNewRoutineDialog} onOpenChange={setShowNewRoutineDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Routine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="routine-name">Routine Name</Label>
              <Input
                id="routine-name"
                value={newRoutine.title}
                onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
                placeholder="e.g., Morning Routine"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routine-description">Description</Label>
              <Textarea
                id="routine-description"
                value={newRoutine.description}
                onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                placeholder="e.g., Improve strength and flexibility"
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routine-icon">Icon</Label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  {React.createElement(getIconByName(selectedIcon), { size: 20, className: "text-primary" })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingIcon(false)
                    setShowIconSelector(true)
                  }}
                >
                  Choose Icon
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="routine-goal">Goal</Label>
              <Textarea
                id="routine-goal"
                value={newRoutine.goal}
                onChange={(e) => setNewRoutine({ ...newRoutine, goal: e.target.value })}
                placeholder="What do you want to achieve with this routine?"
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newRoutine.frequency} onValueChange={(value) => updateFrequency(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-period">Goal Period</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="goal-period"
                    type="number"
                    min="1"
                    max={newRoutine.goalUnit === "days" ? 90 : newRoutine.goalUnit === "weeks" ? 52 : 24}
                    value={newRoutine.goalPeriod}
                    onChange={(e) => setNewRoutine({ ...newRoutine, goalPeriod: Number.parseInt(e.target.value) || 1 })}
                    className="w-20"
                  />
                  <span className="text-sm">{newRoutine.goalUnit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tasks</Label>
              {newRoutine.tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={task}
                    onChange={(e) => updateNewTask(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                  />
                  {newRoutine.tasks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updatedTasks = [...newRoutine.tasks]
                        updatedTasks.splice(index, 1)
                        setNewRoutine({ ...newRoutine, tasks: updatedTasks })
                      }}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addTaskField} className="mt-2">
                <Plus size={16} className="mr-1" /> Add Task
              </Button>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setShowNewRoutineDialog(false)}>
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-initial" onClick={addRoutine}>
              Create Routine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Routine Dialog */}
      {editingRoutine && (
        <Dialog open={!!editingRoutine} onOpenChange={(open) => !open && setEditingRoutine(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Routine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-routine-name">Routine Name</Label>
                <Input
                  id="edit-routine-name"
                  value={editingRoutine.title}
                  onChange={(e) => setEditingRoutine({ ...editingRoutine, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-routine-description">Description</Label>
                <Textarea
                  id="edit-routine-description"
                  value={editingRoutine.description || ""}
                  onChange={(e) => setEditingRoutine({ ...editingRoutine, description: e.target.value })}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-routine-icon">Icon</Label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    {React.createElement(getIconByName(editingRoutine.icon || "Morning Routine"), {
                      size: 20,
                      className: "text-primary",
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedIcon(editingRoutine.icon || "Morning Routine")
                      setIsEditingIcon(true)
                      setShowIconSelector(true)
                    }}
                  >
                    Change Icon
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-routine-goal">Goal</Label>
                <Textarea
                  id="edit-routine-goal"
                  value={editingRoutine.goal}
                  onChange={(e) => setEditingRoutine({ ...editingRoutine, goal: e.target.value })}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select value={editingRoutine.frequency} onValueChange={(value) => updateEditingFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-goal-period">Goal Period</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit-goal-period"
                      type="number"
                      min="1"
                      max={editingRoutine.goalUnit === "days" ? 90 : editingRoutine.goalUnit === "weeks" ? 52 : 24}
                      value={editingRoutine.goalPeriod || 30}
                      onChange={(e) =>
                        setEditingRoutine({
                          ...editingRoutine,
                          goalPeriod: Number.parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-20"
                    />
                    <span className="text-sm">{editingRoutine.goalUnit || "days"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tasks</Label>
                {editingRoutine.tasks.map((task: any) => (
                  <div key={task.id} className="flex gap-2">
                    <Input value={task.title} onChange={(e) => updateEditingTask(task.id, e.target.value)} />
                    {editingRoutine.tasks.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeEditingTask(task.id)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTaskToEditing} className="mt-2">
                  <Plus size={16} className="mr-1" /> Add Task
                </Button>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => deleteRoutine(editingRoutine.id)}
              >
                Delete
              </Button>
              <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
                <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setEditingRoutine(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 sm:flex-initial" onClick={updateRoutine}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Icon Selector Dialog */}
      <IconSelector
        open={showIconSelector}
        onOpenChange={setShowIconSelector}
        selectedIcon={selectedIcon}
        onSelectIcon={handleIconSelect}
      />
    </MobileLayout>
  )
}

function RoutineCard({
  routine,
  onToggleTask,
  onEdit,
  onDelete,
}: {
  routine: any
  onToggleTask: (routineId: number, taskId: number) => void
  onEdit: (routine: any) => void
  onDelete: (id: number) => void
}) {
  const IconComponent = getIconByName(routine.icon || "Morning Routine")

  return (
    <Card className="gradient-card-secondary p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
            <IconComponent size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{routine.title}</h3>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">
                {routine.streak}{" "}
                {routine.frequency === "daily" ? "day" : routine.frequency === "weekly" ? "week" : "month"} streak
                {routine.streak > 0 ? " 🔥" : ""}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground cursor-help flex items-center">
                      {getNextResetText(routine.frequency, routine.lastResetDate)}
                      <Info size={12} className="ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tasks will reset and your streak will update at this time</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(routine)}>
            <Edit size={16} />
          </Button>
          <Progress value={routine.progress} className="w-16 h-1.5" />
        </div>
      </div>

      {routine.description && (
        <div className="mb-3 flex items-start">
          <p className="text-xs text-muted-foreground">{routine.description}</p>
        </div>
      )}

      {routine.goal && (
        <div className="mb-3 flex items-start">
          <Target size={14} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{routine.goal}</p>
        </div>
      )}

      <div className="space-y-2">
        {routine.tasks.map((task: any) => (
          <div key={task.id} className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 mr-2"
              onClick={() => onToggleTask(routine.id, task.id)}
              disabled={task.completed && task.locked}
            >
              {task.completed ? (
                <CheckCircle2 size={16} className="text-primary" />
              ) : (
                <Circle size={16} className="text-muted-foreground" />
              )}
            </Button>
            <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </span>
            {task.completed && task.locked && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2">
                      <Lock size={12} className="text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This task will remain completed until the next reset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
