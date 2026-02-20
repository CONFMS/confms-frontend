"use client"

import { useState } from "react"
import { ConferenceForm } from "./conference-form"
import { AddTrack } from "./add-track"
import { AssignRole } from "./assign-role"
import { ConferenceTemplate } from "./conference-template"
import { ReviewType } from "./review-type"

type Step = "conference" | "track" | "assign-role" | "template" | "review-type"

const STEP_LABELS: Record<Step, string> = {
    conference: "Conference",
    track: "Tracks",
    "assign-role": "Roles",
    template: "Templates",
    "review-type": "Review",
}

const STEPS: Step[] = ["conference", "track", "assign-role", "template", "review-type"]

export default function CreateConferencePage() {
    const [step, setStep] = useState<Step>("conference")
    const [conferenceId, setConferenceId] = useState<number | null>(null)
    const [trackId, setTrackId] = useState<number | null>(null)

    const handleConferenceSuccess = (id: number) => {
        setConferenceId(id)
        setStep("track")
    }

    const handleTrackSuccess = (id: number) => {
        setTrackId(id)
        setStep("assign-role")
    }

    const handleAssignRoleSuccess = () => {
        setStep("template")
    }

    const handleTemplateSuccess = () => {
        setStep("review-type")
    }

    const currentStepIndex = STEPS.indexOf(step)

    return (
        <div className="mx-auto w-full max-w-2xl py-6">
            <div className="mb-8">
                {step === "conference" && (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Conference
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 1: Fill in the details below to create a new conference.
                        </p>
                    </>
                )}
                {step === "track" && (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Add Track
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 2: Add a track to your newly created conference.
                        </p>
                    </>
                )}
                {step === "assign-role" && (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Assign Roles
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 3: Assign roles to users for this conference track.
                        </p>
                    </>
                )}
                {step === "template" && (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Configure Templates
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 4: Set up email templates for your conference.
                        </p>
                    </>
                )}
                {step === "review-type" && (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Review Type
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 5: Configure the review type for your conference.
                        </p>
                    </>
                )}

                {/* Step indicator */}
                <div className="mt-4 flex items-center gap-2">
                    {STEPS.map((s, i) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-colors ${i <= currentStepIndex ? "bg-primary" : "bg-muted"
                                }`}
                        />
                    ))}
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    {STEPS.map((s) => (
                        <span key={s}>{STEP_LABELS[s]}</span>
                    ))}
                </div>
            </div>

            {step === "conference" && (
                <ConferenceForm onSuccess={handleConferenceSuccess} />
            )}

            {step === "track" && conferenceId && (
                <AddTrack
                    conferenceId={conferenceId}
                    onSuccess={handleTrackSuccess}
                />
            )}

            {step === "assign-role" && conferenceId && trackId && (
                <AssignRole
                    conferenceId={conferenceId}
                    trackId={trackId}
                    onSuccess={handleAssignRoleSuccess}
                />
            )}

            {step === "template" && conferenceId && (
                <ConferenceTemplate
                    conferenceId={conferenceId}
                    onSuccess={handleTemplateSuccess}
                />
            )}

            {step === "review-type" && conferenceId && (
                <ReviewType conferenceId={conferenceId} />
            )}
        </div>
    )
}
