"use client"

import { useState } from "react"
import { createTemplate } from "@/app/api/template.api"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { FileText, Mail, Plus, Trash2, Type } from "lucide-react"

interface ConferenceTemplateProps {
    conferenceId: number
    onSuccess: () => void
}

interface TemplateEntry {
    id: number
    templateType: string
    subject: string
    body: string
    isDefault: boolean
}

let nextId = 1

export function ConferenceTemplate({ conferenceId, onSuccess }: ConferenceTemplateProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [templates, setTemplates] = useState<TemplateEntry[]>([
        { id: nextId++, templateType: "", subject: "", body: "", isDefault: false },
    ])

    const addTemplate = () => {
        setTemplates((prev) => [
            ...prev,
            { id: nextId++, templateType: "", subject: "", body: "", isDefault: false },
        ])
    }

    const removeTemplate = (id: number) => {
        if (templates.length <= 1) return
        setTemplates((prev) => prev.filter((t) => t.id !== id))
        setErrors((prev) => {
            const next = { ...prev }
            Object.keys(next)
                .filter((k) => k.endsWith(`_${id}`))
                .forEach((k) => delete next[k])
            return next
        })
    }

    const updateTemplate = (
        id: number,
        field: keyof Omit<TemplateEntry, "id">,
        value: string | boolean
    ) => {
        setTemplates((prev) =>
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
        templates.forEach((t) => {
            if (!t.templateType.trim())
                newErrors[`templateType_${t.id}`] = "Template type is required."
            if (!t.subject.trim())
                newErrors[`subject_${t.id}`] = "Subject is required."
            if (!t.body.trim())
                newErrors[`body_${t.id}`] = "Body is required."
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            const promises = templates.map((t) =>
                createTemplate({
                    conferenceId,
                    templateType: t.templateType,
                    subject: t.subject,
                    body: t.body,
                    isDefault: t.isDefault,
                })
            )
            await Promise.all(promises)
            toast.success(
                templates.length === 1
                    ? "Template created successfully!"
                    : `${templates.length} templates created successfully!`
            )
            onSuccess()
        } catch (error) {
            console.error("Failed to create templates:", error)
            toast.error("Failed to create templates. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldSet>
                <FieldLegend>Conference Templates</FieldLegend>
                <FieldDescription>
                    Configure email templates for your conference notifications.
                </FieldDescription>

                <div className="mt-6 space-y-6">
                    {templates.map((template, index) => (
                        <div
                            key={template.id}
                            className="rounded-lg border p-4"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Template {index + 1}
                                </span>
                                {templates.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            removeTemplate(template.id)
                                        }
                                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>

                            <FieldGroup>
                                {/* Template Type */}
                                <Field
                                    data-invalid={
                                        !!errors[`templateType_${template.id}`] ||
                                        undefined
                                    }
                                >
                                    <FieldLabel>
                                        <Type className="size-4" />
                                        Template Type
                                    </FieldLabel>
                                    <Input
                                        placeholder="e.g. ACCEPTANCE, REJECTION, REMINDER"
                                        value={template.templateType}
                                        onChange={(e) =>
                                            updateTemplate(
                                                template.id,
                                                "templateType",
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors[`templateType_${template.id}`]
                                        }
                                    />
                                    <FieldDescription>
                                        The type/category of this template.
                                    </FieldDescription>
                                    {errors[`templateType_${template.id}`] && (
                                        <FieldError>
                                            {errors[`templateType_${template.id}`]}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Subject */}
                                <Field
                                    data-invalid={
                                        !!errors[`subject_${template.id}`] ||
                                        undefined
                                    }
                                >
                                    <FieldLabel>
                                        <Mail className="size-4" />
                                        Subject
                                    </FieldLabel>
                                    <Input
                                        placeholder="e.g. Your Paper Has Been Accepted"
                                        value={template.subject}
                                        onChange={(e) =>
                                            updateTemplate(
                                                template.id,
                                                "subject",
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors[`subject_${template.id}`]
                                        }
                                    />
                                    <FieldDescription>
                                        The email subject line.
                                    </FieldDescription>
                                    {errors[`subject_${template.id}`] && (
                                        <FieldError>
                                            {errors[`subject_${template.id}`]}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Body */}
                                <Field
                                    data-invalid={
                                        !!errors[`body_${template.id}`] ||
                                        undefined
                                    }
                                >
                                    <FieldLabel>
                                        <FileText className="size-4" />
                                        Body
                                    </FieldLabel>
                                    <Textarea
                                        placeholder="Write the email body content..."
                                        rows={4}
                                        value={template.body}
                                        onChange={(e) =>
                                            updateTemplate(
                                                template.id,
                                                "body",
                                                e.target.value
                                            )
                                        }
                                        aria-invalid={
                                            !!errors[`body_${template.id}`]
                                        }
                                    />
                                    <FieldDescription>
                                        The email body content.
                                    </FieldDescription>
                                    {errors[`body_${template.id}`] && (
                                        <FieldError>
                                            {errors[`body_${template.id}`]}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Is Default */}
                                <Field>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <FieldLabel className="mb-0">
                                                Default Template
                                            </FieldLabel>
                                            <FieldDescription>
                                                Use this as the default template for its type.
                                            </FieldDescription>
                                        </div>
                                        <Switch
                                            checked={template.isDefault}
                                            onCheckedChange={(checked) =>
                                                updateTemplate(
                                                    template.id,
                                                    "isDefault",
                                                    checked
                                                )
                                            }
                                        />
                                    </div>
                                </Field>
                            </FieldGroup>
                        </div>
                    ))}
                </div>

                {/* Add another button */}
                <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={addTemplate}
                >
                    <Plus className="mr-2 size-4" />
                    Add Another Template
                </Button>
            </FieldSet>

            <div className="mt-8 flex items-center justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Saving..."
                        : `Next: Review Type →`}
                </Button>
            </div>
        </form>
    )
}
