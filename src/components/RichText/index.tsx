import React, { Fragment } from 'react'
import Link from 'next/link';
import { LexicalNode, LexicalRichText } from './types'
import {
    IS_BOLD,
    IS_ITALIC,
    IS_STRIKETHROUGH,
    IS_UNDERLINE,
    IS_CODE,
    IS_SUBSCRIPT,
    IS_SUPERSCRIPT
} from './utils'

export function SerializeLexical({ nodes }: { nodes: LexicalNode[] }): React.ReactNode {
    return (
        <Fragment>
            {nodes?.map((node, index) => {
                if (node.type === 'text') {
                    // Verify format exists to avoid errors
                    const format = node.format || 0

                    let text = <span key={index}>{node.text}</span>
                    if (format & IS_BOLD) {
                        text = <strong key={index}>{text}</strong>
                    }
                    if (format & IS_ITALIC) {
                        text = <em key={index}>{text}</em>
                    }
                    if (format & IS_STRIKETHROUGH) {
                        text = <span key={index} className="line-through">{text}</span>
                    }
                    if (format & IS_UNDERLINE) {
                        text = <span key={index} className="underline">{text}</span>
                    }
                    if (format & IS_CODE) {
                        text = <code key={index}>{text}</code>
                    }
                    if (format & IS_SUBSCRIPT) {
                        text = <sub key={index}>{text}</sub>
                    }
                    if (format & IS_SUPERSCRIPT) {
                        text = <sup key={index}>{text}</sup>
                    }

                    return text
                }

                if (!node) {
                    return null
                }

                const serializedChildren = node.children ? (
                    <SerializeLexical nodes={node.children} />
                ) : null

                switch (node.type) {
                    case 'linebreak': {
                        return <br key={index} />
                    }
                    case 'paragraph': {
                        return (
                            <p key={index} className="mb-4 last:mb-0">
                                {serializedChildren}
                            </p>
                        )
                    }
                    case 'heading': {
                        const Tag = (node?.tag as keyof React.JSX.IntrinsicElements) || 'h1'
                        let headingClass = 'font-bold mb-4 mt-8 text-gray-900'
                        if (Tag === 'h1') headingClass += ' text-3xl md:text-4xl'
                        if (Tag === 'h2') headingClass += ' text-2xl md:text-3xl'
                        if (Tag === 'h3') headingClass += ' text-xl md:text-2xl'

                        return (
                            <Tag key={index} className={headingClass}>
                                {serializedChildren}
                            </Tag>
                        )
                    }
                    case 'list': {
                        const Tag = node?.tag === 'ol' ? 'ol' : 'ul'
                        const listClass = node?.tag === 'ol' ? 'list-decimal' : 'list-disc'
                        return (
                            <Tag key={index} className={`${listClass} pl-6 space-y-2 mb-6 text-gray-600`}>
                                {serializedChildren}
                            </Tag>
                        )
                    }
                    case 'listitem': {
                        return (
                            <li key={index} value={node?.value}>
                                {serializedChildren}
                            </li>
                        )
                    }
                    case 'quote': {
                        return (
                            <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic">
                                {serializedChildren}
                            </blockquote>
                        )
                    }
                    case 'link': {
                        const fields = node.fields

                        if (fields?.linkType === 'custom') {
                            return (
                                <Link
                                    href={(fields?.url || '#')}
                                    key={index}
                                    target={fields?.newTab ? '_blank' : undefined}
                                    className="text-primary hover:underline"
                                >
                                    {serializedChildren}
                                </Link>
                            )
                        }
                        // Handle internal links if needed, usually requires resolving the doc
                        return (
                            <span key={index}>{serializedChildren}</span>
                        )
                    }
                    default:
                        return <Fragment key={index}>{serializedChildren}</Fragment>
                }
            })}
        </Fragment>
    )
}

interface RichTextProps {
    className?: string
    content: LexicalRichText
}

export const RichText: React.FC<RichTextProps> = ({ className, content }) => {
    if (!content || !content.root || !content.root.children) {
        return null
    }

    return (
        <div className={`prose prose-rose max-w-none ${className || ''}`}>
            <SerializeLexical nodes={content.root.children} />
        </div>
    )
}

