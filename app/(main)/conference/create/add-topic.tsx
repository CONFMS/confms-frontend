"use client"

import { useState } from "react"
import { createTopic } from "@/app/api/topic.api"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { FileText, Plus, Trash2, Type } from "lucide-react"

interface AddTopicProps {
    trackId: number
    onSuccess: () => void
    onAddAnotherTrack: () => void
}

interface TopicEntry {
    id: number
    title: string
    description: string
}

let nextId = 1

export function AddTopic({ trackId, onSuccess, onAddAnotherTrack }: AddTopicProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [topics, setTopics] = useState<TopicEntry[]>([
        { id: nextId++, title: "", description: "" },
    ])

    const addTopic = () => {
        setTopics((prev) => [...prev, { id: nextId++, title: "", description: "" }])
    }

    const removeTopic = (id: number) => {
        if (topics.length <= 1) return
        setTopics((prev) => prev.filter((t) => t.id !== id))
        setErrors((prev) => {
            const next = { ...prev }
            Object.keys(next)
                .filter((k) => k.endsWith(`_${id}`))
                .forEach((k) => delete next[k])
            return next
        })
    }

    const updateTopic = (id: number, field: "title" | "description", value: string) => {
        setTopics((prev) =>
            prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
        )
        const errorKey = `${field}_${id}`
        if (errors[errorKey]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[errorKey]
                return next
            })
        }
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        topics.forEach((t) => {
            if (!t.title.trim())
                newErrors[`title_${t.id}`] = "Topic title is required."
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent, addAnother: boolean) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            const promises = topics.map((t) =>
                createTopic({
                    trackId,
                    title: t.title,
                    description: t.description,
                })
            )
            await Promise.all(promises)
            toast.success(
                topics.length === 1
                    ? "Topic created successfully!"
                    : `${topics.length} topics created successfully!`
            )
            if (addAnother) {
                onAddAnotherTrack()
            } else {
                onSuccess()
            }
        } catch (error) {
            console.error("Failed to create topics:", error)
            toast.error("Failed to create topics. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, false)}>
            <FieldSet>
                <FieldLegend>Track Topics</FieldLegend>
                <FieldDescription>
                    Add topics for this track. Each track can have multiple topics.
                </FieldDescription>

                <div className="mt-6 space-y-6">
                    {topics.map((topic, index) => (
                        <div
                            key={topic.id}
                            className="rounded-lg border p-4"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Topic {index + 1}
                                </span>
                                {topics.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTopic(topic.id)}
                                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>

                            <FieldGroup>
                                {/* Title */}
                                <Field
                                    data-invalid={
                                        !!errors[`title_${topic.id}`] || undefined
                                    }
                                >
                                    <FieldLabel>
                                        <Type className="size-4" />
                                        Title
                                    </FieldLabel>
                                    <Input
                                        placeholder="e.g. Machine Learning"
                                        value={topic.title}
                                        onChange={(e) =>
                                            updateTopic(topic.id, "title", e.target.value)
                                        }
                                        aria-invalid={!!errors[`title_${topic.id}`]}
                                    />
                                    <FieldDescription>
                                        The title of this topic.
                                    </FieldDescription>
                                    {errors[`title_${topic.id}`] && (
                                        <FieldError>
                                            {errors[`title_${topic.id}`]}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Description */}
                                <Field>
                                    <FieldLabel>
                                        <FileText className="size-4" />
                                        Description
                                    </FieldLabel>
                                    <Textarea
                                        placeholder="Describe the topic scope..."
                                        rows={3}
                                        value={topic.description}
                                        onChange={(e) =>
                                            updateTopic(
                                                topic.id,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <FieldDescription>
                                        A brief description of what this topic covers.
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </div>
                    ))}
                </div>

                {/* Add another topic */}
                <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={addTopic}
                >
                    <Plus className="mr-2 size-4" />
                    Add Another Topic
                </Button>
            </FieldSet>

            <div className="mt-8 flex items-center justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                >
                    Save & Add Another Track
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Next: Assign Roles →"}
                </Button>
            </div>
        </form>
    )
}
