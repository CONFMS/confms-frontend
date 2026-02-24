"use client"

import { useState } from "react"
import { createTrack } from "@/app/api/conference.api"
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
import { CalendarIcon, FileText, Hash, Type } from "lucide-react"

interface AddTrackProps {
    conferenceId: number
    onSuccess: (trackId: number) => void
}

export function AddTrack({ conferenceId, onSuccess }: AddTrackProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        submissionStart: "",
        submissionEnd: "",
        registrationStart: "",
        registrationEnd: "",
        cameraReadyStart: "",
        cameraReadyEnd: "",
        biddingStart: "",
        biddingEnd: "",
        reviewStart: "",
        reviewEnd: "",
        maxSubmissions: "",
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
        if (!formData.name.trim()) newErrors.name = "Track name is required."
        if (!formData.submissionStart) newErrors.submissionStart = "Required."
        if (!formData.submissionEnd) newErrors.submissionEnd = "Required."
        if (!formData.registrationStart) newErrors.registrationStart = "Required."
        if (!formData.registrationEnd) newErrors.registrationEnd = "Required."
        if (!formData.cameraReadyStart) newErrors.cameraReadyStart = "Required."
        if (!formData.cameraReadyEnd) newErrors.cameraReadyEnd = "Required."
        if (!formData.biddingStart) newErrors.biddingStart = "Required."
        if (!formData.biddingEnd) newErrors.biddingEnd = "Required."
        if (!formData.reviewStart) newErrors.reviewStart = "Required."
        if (!formData.reviewEnd) newErrors.reviewEnd = "Required."
        if (!formData.maxSubmissions || Number(formData.maxSubmissions) <= 0)
            newErrors.maxSubmissions = "Must be a positive number."
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                conferenceId,
                submissionStart: new Date(formData.submissionStart).toISOString(),
                submissionEnd: new Date(formData.submissionEnd).toISOString(),
                registrationStart: new Date(formData.registrationStart).toISOString(),
                registrationEnd: new Date(formData.registrationEnd).toISOString(),
                cameraReadyStart: new Date(formData.cameraReadyStart).toISOString(),
                cameraReadyEnd: new Date(formData.cameraReadyEnd).toISOString(),
                biddingStart: new Date(formData.biddingStart).toISOString(),
                biddingEnd: new Date(formData.biddingEnd).toISOString(),
                reviewStart: new Date(formData.reviewStart).toISOString(),
                reviewEnd: new Date(formData.reviewEnd).toISOString(),
                maxSubmissions: Number(formData.maxSubmissions),
            }
            const result = await createTrack(payload)
            toast.success("Track added successfully!")
            onSuccess(result.id)
        } catch (error) {
            console.error("Failed to create track:", error)
            toast.error("Failed to add track. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldSet>
                <FieldLegend>Track Information</FieldLegend>
                <FieldDescription>
                    Provide the basic information about this track.
                </FieldDescription>

                <FieldGroup>
                    {/* Name */}
                    <Field data-invalid={!!errors.name || undefined}>
                        <FieldLabel htmlFor="name">
                            <Type className="size-4" />
                            Track Name
                        </FieldLabel>
                        <Input
                            id="name"
                            placeholder="e.g. Main Research Track"
                            value={formData.name}
                            onChange={handleChange}
                            aria-invalid={!!errors.name}
                        />
                        <FieldDescription>
                            The name of this conference track.
                        </FieldDescription>
                        {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>

                    {/* Description */}
                    <Field>
                        <FieldLabel htmlFor="description">
                            <FileText className="size-4" />
                            Description
                        </FieldLabel>
                        <Textarea
                            id="description"
                            placeholder="Describe the track topics and scope..."
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <FieldDescription>
                            A brief description of what this track covers.
                        </FieldDescription>
                    </Field>

                    {/* Max Submissions */}
                    <Field data-invalid={!!errors.maxSubmissions || undefined}>
                        <FieldLabel htmlFor="maxSubmissions">
                            <Hash className="size-4" />
                            Max Submissions
                        </FieldLabel>
                        <Input
                            id="maxSubmissions"
                            type="number"
                            placeholder="e.g. 100"
                            value={formData.maxSubmissions}
                            onChange={handleChange}
                            aria-invalid={!!errors.maxSubmissions}
                        />
                        <FieldDescription>
                            Maximum number of submissions allowed for this track.
                        </FieldDescription>
                        {errors.maxSubmissions && (
                            <FieldError>{errors.maxSubmissions}</FieldError>
                        )}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="my-8 border-t" />

            <FieldSet>
                <FieldLegend>Submission Period</FieldLegend>
                <FieldDescription>
                    Set the start and end dates for paper submissions.
                </FieldDescription>
                <FieldGroup>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field data-invalid={!!errors.submissionStart || undefined}>
                            <FieldLabel htmlFor="submissionStart">
                                <CalendarIcon className="size-4" />
                                Submission Start
                            </FieldLabel>
                            <Input
                                id="submissionStart"
                                type="datetime-local"
                                value={formData.submissionStart}
                                onChange={handleChange}
                                aria-invalid={!!errors.submissionStart}
                            />
                            {errors.submissionStart && (
                                <FieldError>{errors.submissionStart}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.submissionEnd || undefined}>
                            <FieldLabel htmlFor="submissionEnd">
                                <CalendarIcon className="size-4" />
                                Submission End
                            </FieldLabel>
                            <Input
                                id="submissionEnd"
                                type="datetime-local"
                                value={formData.submissionEnd}
                                onChange={handleChange}
                                aria-invalid={!!errors.submissionEnd}
                            />
                            {errors.submissionEnd && (
                                <FieldError>{errors.submissionEnd}</FieldError>
                            )}
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>

            <div className="my-8 border-t" />

            <FieldSet>
                <FieldLegend>Registration Period</FieldLegend>
                <FieldDescription>
                    Set the start and end dates for participant registration.
                </FieldDescription>
                <FieldGroup>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field data-invalid={!!errors.registrationStart || undefined}>
                            <FieldLabel htmlFor="registrationStart">
                                <CalendarIcon className="size-4" />
                                Registration Start
                            </FieldLabel>
                            <Input
                                id="registrationStart"
                                type="datetime-local"
                                value={formData.registrationStart}
                                onChange={handleChange}
                                aria-invalid={!!errors.registrationStart}
                            />
                            {errors.registrationStart && (
                                <FieldError>{errors.registrationStart}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.registrationEnd || undefined}>
                            <FieldLabel htmlFor="registrationEnd">
                                <CalendarIcon className="size-4" />
                                Registration End
                            </FieldLabel>
                            <Input
                                id="registrationEnd"
                                type="datetime-local"
                                value={formData.registrationEnd}
                                onChange={handleChange}
                                aria-invalid={!!errors.registrationEnd}
                            />
                            {errors.registrationEnd && (
                                <FieldError>{errors.registrationEnd}</FieldError>
                            )}
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>

            <div className="my-8 border-t" />

            <FieldSet>
                <FieldLegend>Camera-Ready Period</FieldLegend>
                <FieldDescription>
                    Set the start and end dates for camera-ready submission.
                </FieldDescription>
                <FieldGroup>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field data-invalid={!!errors.cameraReadyStart || undefined}>
                            <FieldLabel htmlFor="cameraReadyStart">
                                <CalendarIcon className="size-4" />
                                Camera-Ready Start
                            </FieldLabel>
                            <Input
                                id="cameraReadyStart"
                                type="datetime-local"
                                value={formData.cameraReadyStart}
                                onChange={handleChange}
                                aria-invalid={!!errors.cameraReadyStart}
                            />
                            {errors.cameraReadyStart && (
                                <FieldError>{errors.cameraReadyStart}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.cameraReadyEnd || undefined}>
                            <FieldLabel htmlFor="cameraReadyEnd">
                                <CalendarIcon className="size-4" />
                                Camera-Ready End
                            </FieldLabel>
                            <Input
                                id="cameraReadyEnd"
                                type="datetime-local"
                                value={formData.cameraReadyEnd}
                                onChange={handleChange}
                                aria-invalid={!!errors.cameraReadyEnd}
                            />
                            {errors.cameraReadyEnd && (
                                <FieldError>{errors.cameraReadyEnd}</FieldError>
                            )}
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>

            <div className="my-8 border-t" />

            <FieldSet>
                <FieldLegend>Bidding Period</FieldLegend>
                <FieldDescription>
                    Set the start and end dates for reviewer bidding.
                </FieldDescription>
                <FieldGroup>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field data-invalid={!!errors.biddingStart || undefined}>
                            <FieldLabel htmlFor="biddingStart">
                                <CalendarIcon className="size-4" />
                                Bidding Start
                            </FieldLabel>
                            <Input
                                id="biddingStart"
                                type="datetime-local"
                                value={formData.biddingStart}
                                onChange={handleChange}
                                aria-invalid={!!errors.biddingStart}
                            />
                            {errors.biddingStart && (
                                <FieldError>{errors.biddingStart}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.biddingEnd || undefined}>
                            <FieldLabel htmlFor="biddingEnd">
                                <CalendarIcon className="size-4" />
                                Bidding End
                            </FieldLabel>
                            <Input
                                id="biddingEnd"
                                type="datetime-local"
                                value={formData.biddingEnd}
                                onChange={handleChange}
                                aria-invalid={!!errors.biddingEnd}
                            />
                            {errors.biddingEnd && (
                                <FieldError>{errors.biddingEnd}</FieldError>
                            )}
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>

            <div className="my-8 border-t" />

            <FieldSet>
                <FieldLegend>Review Period</FieldLegend>
                <FieldDescription>
                    Set the start and end dates for the review process.
                </FieldDescription>
                <FieldGroup>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field data-invalid={!!errors.reviewStart || undefined}>
                            <FieldLabel htmlFor="reviewStart">
                                <CalendarIcon className="size-4" />
                                Review Start
                            </FieldLabel>
                            <Input
                                id="reviewStart"
                                type="datetime-local"
                                value={formData.reviewStart}
                                onChange={handleChange}
                                aria-invalid={!!errors.reviewStart}
                            />
                            {errors.reviewStart && (
                                <FieldError>{errors.reviewStart}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.reviewEnd || undefined}>
                            <FieldLabel htmlFor="reviewEnd">
                                <CalendarIcon className="size-4" />
                                Review End
                            </FieldLabel>
                            <Input
                                id="reviewEnd"
                                type="datetime-local"
                                value={formData.reviewEnd}
                                onChange={handleChange}
                                aria-invalid={!!errors.reviewEnd}
                            />
                            {errors.reviewEnd && (
                                <FieldError>{errors.reviewEnd}</FieldError>
                            )}
                        </Field>
                    </div>
                </FieldGroup>
            </FieldSet>

            <div className="mt-8 flex items-center justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Next: Add Topics →"}
                </Button>
            </div>
        </form>
    )
}
