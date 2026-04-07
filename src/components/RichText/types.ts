export interface LexicalNode {
    type: string
    text?: string
    format?: number
    version: number
    children?: LexicalNode[]
    tag?: string
    value?: number
    detail?: number
    mode?: string
    style?: string
    fields?: {
        linkType?: 'custom' | 'internal'
        newTab?: boolean
        url?: string
        doc?: {
            relationTo: string
            value: unknown
        }
    }
    [key: string]: unknown
}

export interface LexicalRichText {
    root: {
        type: string;
        children: LexicalNode[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
    };
    [k: string]: unknown;
}
