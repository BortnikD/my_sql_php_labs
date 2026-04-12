export interface FieldDef<T> {
    key: keyof T
    label: string
    type?: 'text' | 'number' | 'date'
    readonly?: boolean
}
