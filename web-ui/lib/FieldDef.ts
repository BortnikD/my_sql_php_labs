export interface FieldValidation {
    predicate: (value: unknown) => boolean | Promise<boolean>
    message: string
}

export interface FieldDef<T> {
    key: keyof T
    label: string
    type?: 'text' | 'number' | 'date'
    readonly?: boolean
    validations?: FieldValidation[]
}
