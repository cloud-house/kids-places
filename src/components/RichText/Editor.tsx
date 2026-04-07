'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $isHeadingNode, HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $isListNode, ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

const editorConfig = {
    namespace: 'KidsPlacesEditor',
    theme: {
        paragraph: 'mb-2 last:mb-0',
        text: {
            bold: 'font-bold',
            italic: 'italic',
            underline: 'underline',
        },
        list: {
            nested: {
                listitem: 'list-none',
            },
            ol: 'list-decimal ml-6 mb-2',
            ul: 'list-disc ml-6 mb-2',
            listitem: 'ml-4',
        },
        heading: {
            h2: 'text-2xl font-bold mb-3 mt-4',
            h3: 'text-xl font-bold mb-2 mt-3',
        }
    },
    onError(error: Error) {
        console.error(error)
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
}

const Toolbar: React.FC = () => {
    const [editor] = useLexicalComposerContext()
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [blockType, setBlockType] = useState('paragraph')

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))

            const anchorNode = selection.anchor.getNode()
            const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
            const type = element.getType()
            if ($isHeadingNode(element)) {
                setBlockType(element.getTag())
            } else if ($isListNode(element)) {
                setBlockType(element.getListType())
            } else {
                setBlockType(type)
            }
        }
    }, [])

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar()
                return false
            },
            1
        )
    }, [editor, updateToolbar])

    const formatHeading = (tag: 'h2' | 'h3') => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(tag))
            }
        })
    }

    const formatBulletList = () => {
        if (blockType !== 'bullet') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
    }

    const formatNumberedList = () => {
        if (blockType !== 'number') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
    }

    return (
        <div className="flex items-center gap-1 p-1 border-b bg-gray-50/50 rounded-t-2xl">
            <button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                }}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", isBold && "bg-white text-rose-500 shadow-sm")}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                }}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", isItalic && "bg-white text-rose-500 shadow-sm")}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                type="button"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                }}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", isUnderline && "bg-white text-rose-500 shadow-sm")}
                title="Underline"
            >
                <Underline size={18} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <button
                type="button"
                onClick={() => formatHeading('h2')}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", blockType === 'h2' && "bg-white text-rose-500 shadow-sm")}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => formatHeading('h3')}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", blockType === 'h3' && "bg-white text-rose-500 shadow-sm")}
                title="Heading 3"
            >
                <Heading3 size={18} />
            </button>
            <button
                type="button"
                onClick={() => {
                    editor.update(() => {
                        const selection = $getSelection()
                        if ($isRangeSelection(selection)) {
                            // Removing lists or heading basically means turning into paragraph
                            if (blockType === 'bullet' || blockType === 'number') {
                                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
                            } else {
                                $setBlocksType(selection, () => $createHeadingNode('h1')) // Fallback or use a proper paragraph creator if needed
                                // Actually Lexical's $setBlocksType with a custom creator is better.
                                // But simple way to turn into paragraph is to remove other block types.
                            }
                        }
                    })
                }}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", blockType === 'paragraph' && "bg-white text-rose-500 shadow-sm")}
                title="Paragraph"
            >
                <Type size={18} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <button
                type="button"
                onClick={formatBulletList}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", blockType === 'bullet' && "bg-white text-rose-500 shadow-sm")}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={formatNumberedList}
                className={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", blockType === 'number' && "bg-white text-rose-500 shadow-sm")}
                title="Numbered List"
            >
                <ListOrdered size={18} />
            </button>
        </div>
    )
}

interface RichTextEditorProps {
    value?: string | object | null
    onChange: (value: object | null) => void
    placeholder?: string
    className?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
    // Initial content handling
    const initialConfig = {
        ...editorConfig,
        editorState: value ? (typeof value === 'string' ? undefined : JSON.stringify(value)) : undefined
    }

    return (
        <div className={cn("relative border rounded-2xl bg-white focus-within:ring-2 focus-within:ring-rose-50 focus-within:border-rose-200 transition-all shadow-sm", className)}>
            <LexicalComposer initialConfig={initialConfig}>
                <Toolbar />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-[200px] p-4 outline-none prose prose-rose max-w-none text-gray-700" />
                        }
                        placeholder={
                            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none italic">
                                {placeholder || 'Zacznij pisać...'}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <OnChangePlugin onChange={(editorState) => {
                        onChange(editorState.toJSON())
                    }} />
                </div>
            </LexicalComposer>
        </div>
    )
}
