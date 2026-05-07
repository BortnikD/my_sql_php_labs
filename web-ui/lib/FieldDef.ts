export interface FieldValidation {
    predicate: (value: unknown) => boolean | Promise<boolean>
    message: string
}

export interface RelationOption {
    id: number
    title: string
}

export interface FieldDef<T> {
    key: keyof T
    label: string
    type?: 'text' | 'number' | 'date'
    readonly?: boolean
    options?: string[]
    validations?: FieldValidation[]
    relation?: {
        fetchOptions: () => Promise<RelationOption[]>
    }
}
