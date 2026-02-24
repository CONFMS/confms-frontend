'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPapersByAuthor, assignAuthorToPaper, getAuthorsByPaper } from '@/app/api/paper.api'
import { getUsers } from '@/app/api/user.api'
import type { PaperResponse } from '@/types/paper'
import type { User } from '@/types/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, UserPlus, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function UserSubmissionsPage() {
    const router = useRouter()
    const [papers, setPapers] = useState<PaperResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [selectedPaper, setSelectedPaper] = useState<number | null>(null)
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [authors, setAuthors] = useState<{ [paperId: number]: User[] }>({})
    const [isAssigning, setIsAssigning] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [viewAuthorsDialog, setViewAuthorsDialog] = useState<number | null>(null)

    useEffect(() => {
        fetchPapers()
        fetchUsers()
    }, [])

    const fetchPapers = async () => {
        try {
            setLoading(true)
            const data = await getPapersByAuthor(Number(localStorage.getItem('userId')))
            setPapers(data)
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('You must be logged in to view your submissions.')
                setTimeout(() => {
                    router.push('/auth/login')
                }, 2000)
            } else {
                setError('Failed to load submissions. Please try again later.')
            }
            console.error('Error fetching papers:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (err) {
            console.error('Error fetching users:', err)
        }
    }

    const fetchAuthors = async (paperId: number) => {
        try {
            const data = await getAuthorsByPaper(paperId)
            setAuthors(prev => ({ ...prev, [paperId]: data }))
        } catch (err) {
            console.error('Error fetching authors:', err)
            toast.error('Failed to load authors')
        }
    }

    const handleAssignAuthor = async () => {
        if (!selectedPaper || !selectedUser) {
            toast.error('Please select a user')
            return
        }

        try {
            setIsAssigning(true)
            await assignAuthorToPaper(selectedPaper, Number(selectedUser))
            toast.success('Author assigned successfully!')
            setOpenDialog(false)
            setSelectedUser('')
            // Refresh authors list for this paper
            await fetchAuthors(selectedPaper)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to assign author')
            console.error('Error assigning author:', err)
        } finally {
            setIsAssigning(false)
        }
    }

    const handleViewAuthors = async (paperId: number) => {
        setViewAuthorsDialog(paperId)
        if (!authors[paperId]) {
            await fetchAuthors(paperId)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-destructive text-lg">{error}</p>
                {error.includes('logged in') && (
                    <Button onClick={() => router.push('/auth/login')}>
                        Go to Login
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">My Paper Submissions</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your paper submissions and co-authors
                </p>
            </div>

            {papers.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">You haven&apos;t submitted any papers yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {papers.map((paper) => (
                        <Card key={paper.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{paper.title}</CardTitle>
                                        <CardDescription className="mt-2">
                                            <div className="space-y-1">
                                                <p><strong>Conference:</strong> {paper.track.conference.name} ({paper.track.conference.acronym})</p>
                                                <p><strong>Track:</strong> {paper.track.name}</p>
                                                <p><strong>Topic:</strong> {paper.topic.title}</p>
                                            </div>
                                        </CardDescription>
                                    </div>
                                    <Badge variant={paper.status === 'SUBMITTED' ? 'default' : 'secondary'}>
                                        {paper.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Abstract</h4>
                                        <p className="text-sm text-muted-foreground">{paper.abstractField}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline">{paper.keyword1}</Badge>
                                            <Badge variant="outline">{paper.keyword2}</Badge>
                                            <Badge variant="outline">{paper.keyword3}</Badge>
                                            <Badge variant="outline">{paper.keyword4}</Badge>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Submitted:</strong> {formatDate(paper.submissionTime)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Plagiarism Check:</strong> {paper.isPassedPlagiarism ? 'Passed' : 'Pending'}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        <Dialog open={openDialog && selectedPaper === paper.id} onOpenChange={(open) => {
                                            setOpenDialog(open)
                                            if (open) setSelectedPaper(paper.id)
                                            else {
                                                setSelectedPaper(null)
                                                setSelectedUser('')
                                            }
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Add Co-Author
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Co-Author</DialogTitle>
                                                    <DialogDescription>
                                                        Select a user to add as a co-author to this paper.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="user-select">Select User</Label>
                                                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                                                            <SelectTrigger id="user-select">
                                                                <SelectValue placeholder="Choose a user" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                                        {user.fullName} ({user.email})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button 
                                                        onClick={handleAssignAuthor} 
                                                        disabled={isAssigning || !selectedUser}
                                                        className="w-full"
                                                    >
                                                        {isAssigning ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Assigning...
                                                            </>
                                                        ) : (
                                                            'Assign Author'
                                                        )}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={viewAuthorsDialog === paper.id} onOpenChange={(open) => {
                                            if (!open) setViewAuthorsDialog(null)
                                            else handleViewAuthors(paper.id)
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    View Authors
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Paper Authors</DialogTitle>
                                                    <DialogDescription>
                                                        List of all authors for this paper
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    {!authors[paper.id] ? (
                                                        <div className="flex justify-center py-8">
                                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                        </div>
                                                    ) : authors[paper.id].length === 0 ? (
                                                        <p className="text-center text-muted-foreground py-8">
                                                            No co-authors added yet
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {authors[paper.id].map((author) => (
                                                                <Card key={author.id}>
                                                                    <CardContent className="py-3">
                                                                        <p className="font-medium">{author.fullName}</p>
                                                                        <p className="text-sm text-muted-foreground">{author.email}</p>
                                                                        {author.phoneNumber && (
                                                                            <p className="text-sm text-muted-foreground">{author.phoneNumber}</p>
                                                                        )}
                                                                        {author.country && (
                                                                            <p className="text-sm text-muted-foreground">{author.country}</p>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
