"use client"

import { useMemo } from "react"
import countryList from "react-select-country-list"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CountrySelectProps {
    value: string
    onValueChange: (value: string) => void
}

export function CountrySelect({ value, onValueChange }: CountrySelectProps) {
    const countries = useMemo(() => countryList().getData(), [])

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="">
                <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
                {countries.map((country) => (
                    <SelectItem key={country.value} value={country.label}>
                        {country.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
