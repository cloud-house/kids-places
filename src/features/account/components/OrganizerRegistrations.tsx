'use client'

import { Inquiry } from '@/payload-types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

import { GraduationCap } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface ExtendedInquiry extends Inquiry {
    sourceName?: string
}

interface OrganizerRegistrationsProps {
    inquiries: ExtendedInquiry[]
}

export const OrganizerRegistrations = ({ inquiries }: OrganizerRegistrationsProps) => {
    if (!inquiries || inquiries.length === 0) {
        return (
            <EmptyState
                icon={GraduationCap}
                message="Brak zapisów na Twoje wydarzenia."
            />
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Nowe</Badge>
            case 'contacted':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">W kontakcie</Badge>
            case 'enrolled':
                return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Zapisano</Badge>
            case 'rejected':
                return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Odrzucono</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getSourceTypeLabel = (type: string) => {
        switch (type) {
            case 'events': return 'Wydarzenie'
            case 'places': return 'Miejsce'
            default: return type
        }
    }

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Źródło</TableHead>
                            <TableHead>Imię i Nazwisko</TableHead>
                            <TableHead>Kontakt</TableHead>
                            <TableHead>Wiadomość</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span>
                                            {new Date(inquiry.createdAt).toLocaleString('pl-PL', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span className="text-gray-400 text-xs mt-1">
                                            {new Date(inquiry.createdAt).toLocaleTimeString('pl-PL', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{inquiry.sourceName || 'Nieznane'}</span>
                                        <span className="text-xs text-gray-500">{getSourceTypeLabel(inquiry.sourceType)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">{inquiry.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-sm">
                                        <a href={`mailto:${inquiry.email}`} className="text-rose-500 hover:underline font-medium">{inquiry.email}</a>
                                        {inquiry.phone && (
                                            <a href={`tel:${inquiry.phone}`} className="text-gray-600 hover:underline">{inquiry.phone}</a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="min-w-[200px] whitespace-normal text-gray-500 text-sm leading-relaxed">
                                    {inquiry.message}
                                </TableCell>
                                <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
