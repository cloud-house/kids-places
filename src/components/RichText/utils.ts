import { LexicalRichText, LexicalNode } from './types'

export const IS_BOLD = 1
export const IS_ITALIC = 1 << 1
export const IS_STRIKETHROUGH = 1 << 2
export const IS_UNDERLINE = 1 << 3
export const IS_CODE = 1 << 4
export const IS_SUBSCRIPT = 1 << 5
export const IS_SUPERSCRIPT = 1 << 6

export const stringToLexical = (text: string): LexicalRichText => ({
    root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
            {
                type: 'paragraph',
                format: 0,
                indent: 0,
                version: 1,
                children: [
                    {
                        type: 'text',
                        text: text,
                        format: 0,
                        version: 1,
                        detail: 0,
                        mode: 'normal',
                        style: ''
                    } as LexicalNode,
                ],
            } as LexicalNode,
        ],
        direction: 'ltr',
    },
});
