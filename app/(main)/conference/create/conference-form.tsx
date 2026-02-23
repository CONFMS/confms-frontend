"use client"

import { useState } from "react"
import { createConference } from "@/app/api/conference.api"
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
import { CalendarIcon, Globe, MapPin, Tag, FileText, Type } from "lucide-react"

interface ConferenceFormProps {
    onSuccess: (conferenceId: number) => void
}

export function ConferenceForm({ onSuccess }: ConferenceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        name: "",
        acronym: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",

        websiteUrl: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
        if (errors[id]) {
            setErrors((prev) => {
                const next = { ...prev }
                delete next[id]
                return next
            })
        }
    }



    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = "Conference name is required."
        if (!formData.acronym.trim()) newErrors.acronym = "Acronym is required."
        if (!formData.description.trim())
            newErrors.description = "Description is required."
        if (!formData.location.trim()) newErrors.location = "Location is required."
        if (!formData.startDate) newErrors.startDate = "Start date is required."
        if (!formData.endDate) newErrors.endDate = "End date is required."
        if (
            formData.startDate &&
            formData.endDate &&
            new Date(formData.endDate) < new Date(formData.startDate)
        ) {
            newErrors.endDate = "End date must be after start date."
        }

        if (
            formData.websiteUrl &&
            !/^https?:\/\/.+\..+/.test(formData.websiteUrl)
        ) {
            newErrors.websiteUrl = "Please enter a valid URL (e.g. https://example.com)."
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            const payload = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            }
            const result = await createConference(payload)
            toast.success("Conference created successfully!")
            onSuccess(result.id)
        } catch (error) {
            console.error("Failed to create conference:", error)
            toast.error("Failed to create conference. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldSet>
                <FieldLegend>Conference Details</FieldLegend>
                <FieldDescription>
                    Provide the basic information about your conference.
                </FieldDescription>

                <FieldGroup>
                    {/* Name */}
                    <Field data-invalid={!!errors.name || undefined}>
                        <FieldLabel htmlFor="name">
                            <Type className="size-4" />
                            Conference Name
                        </FieldLabel>
                        <Input
                            id="name"
                            placeholder="e.g. International Conference on Software Engineering"
                            value={formData.name}
                            onChange={handleChange}
                            aria-invalid={!!errors.name}
                        />
                        <FieldDescription>
                            The full official name of your conference.
                        </FieldDescription>
                        {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>

                    {/* Acronym */}
                    <Field data-invalid={!!errors.acronym || undefined}>
                        <FieldLabel htmlFor="acronym">
                            <Tag className="size-4" />
                            Acronym
                        </FieldLabel>
                        <Input
                            id="acronym"
                            placeholder="e.g. ICSE"
                            value={formData.acronym}
                            onChange={handleChange}
                            aria-invalid={!!errors.acronym}
                        />
                        <FieldDescription>
                            A short abbreviation for the conference.
                        </FieldDescription>
                        {errors.acronym && (
                            <FieldError>{errors.acronym}</FieldError>
                        )}
                    </Field>

                    {/* Description */}
                    <Field data-invalid={!!errors.description || undefined}>
                        <FieldLabel htmlFor="description">
                            <FileText className="size-4" />
                            Description
                        </FieldLabel>
                        <Textarea
                            id="description"
                            placeholder="Describe the conference topics, goals, and audience..."
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            aria-invalid={!!errors.description}
                        />
                        <FieldDescription>
                            A brief overview of what the conference is about.
                        </FieldDescription>
                        {errors.description && (
                            <FieldError>{errors.description}</FieldError>
                        )}
                    </Field>

                    {/* Location */}
                    <Field data-invalid={!!errors.location || undefined}>
                        <FieldLabel htmlFor="location">
                            <MapPin className="size-4" />
                            Location
                        </FieldLabel>
                        <Input
                            id="location"
                            placeholder="e.g. Ho Chi Minh City, Vietnam"
                            value={formData.location}
                            onChange={handleChange}
                            aria-invalid={!!errors.location}
                        />
                        <FieldDescription>
                            The city and country where the conference will be held.
                        </FieldDescription>
                        {errors.location && (
                            <FieldError>{errors.location}</FieldError>
                        )}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="my-8 border-t" />

            <FieldSet>
                <FieldLegend>Schedule</FieldLegend>
                <FieldDescription>
                    Set the conference dates.
                </FieldDescription>

                <FieldGroup>
                    {/* Start Date */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field data-invalid={!!errors.startDate || undefined}>
                            <FieldLabel htmlFor="startDate">
                                <CalendarIcon className="size-4" />
                                Start Date
                            </FieldLabel>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={handleChange}
                                aria-invalid={!!errors.startDate}
                            />
                            {errors.startDate && (
                                <FieldError>{errors.startDate}</FieldError>
                            )}
                        </Field>

                        {/* End Date */}
                        <Field data-invalid={!!errors.endDate || undefined}>
                            <FieldLabel htmlFor="endDate">
                                <CalendarIcon className="size-4" />
                                End Date
                            </FieldLabel>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={handleChange}
                                aria-invalid={!!errors.endDate}
                            />
                            {errors.endDate && (
                                <FieldError>{errors.endDate}</FieldError>
                            )}
                        </Field>
                    </div>



                    {/* Website URL */}
                    <Field data-invalid={!!errors.websiteUrl || undefined}>
                        <FieldLabel htmlFor="websiteUrl">
                            <Globe className="size-4" />
                            Website URL
                        </FieldLabel>
                        <Input
                            id="websiteUrl"
                            type="url"
                            placeholder="https://example.com"
                            value={formData.websiteUrl}
                            onChange={handleChange}
                            aria-invalid={!!errors.websiteUrl}
                        />
                        <FieldDescription>
                            Optional. The official website for the conference.
                        </FieldDescription>
                        {errors.websiteUrl && (
                            <FieldError>{errors.websiteUrl}</FieldError>
                        )}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="mt-8 flex items-center justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Next: Add Tracks →"}
                </Button>
            </div>
        </form>
    )
}
