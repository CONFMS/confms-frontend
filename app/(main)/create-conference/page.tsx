"use client"

import { useState } from "react"
import { ConferenceForm } from "./conference-form"
import { AddTrack } from "./add-track"

export default function CreateConferencePage() {
    const [step, setStep] = useState<"conference" | "track">("conference")
    const [conferenceId, setConferenceId] = useState<number | null>(null)

    const handleConferenceSuccess = (id: number) => {
        setConferenceId(id)
        setStep("track")
    }

    return (
        <div className="mx-auto w-full max-w-2xl py-6">
            <div className="mb-8">
                {step === "conference" ? (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Conference
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 1: Fill in the details below to create a new conference.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Add Track
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Step 2: Add a track to your newly created conference.
                        </p>
                    </>
                )}

                {/* Step indicator */}
                <div className="mt-4 flex items-center gap-2">
                    <div className={`h-2 flex-1 rounded-full ${step === "conference" ? "bg-primary" : "bg-primary"}`} />
                    <div className={`h-2 flex-1 rounded-full ${step === "track" ? "bg-primary" : "bg-muted"}`} />
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Conference Details</span>
                    <span>Add Tracks</span>
                </div>
            </div>

            {step === "conference" && (
                <ConferenceForm onSuccess={handleConferenceSuccess} />
            )}

            {step === "track" && conferenceId && (
                <AddTrack conferenceId={conferenceId} />
            )}
        </div>
    )
}
