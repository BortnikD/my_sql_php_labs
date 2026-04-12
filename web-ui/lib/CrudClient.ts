import { AxiosResponse } from 'axios'

export interface CrudClient<T, CreateDto, UpdateDto = CreateDto> {
    getAll(): Promise<AxiosResponse<T[]>>
    create(dto: CreateDto): Promise<AxiosResponse<{ id: number }>>
    update(id: number, dto: UpdateDto): Promise<AxiosResponse<{ updated: boolean }>>
    delete(id: number): Promise<AxiosResponse<{ deleted: boolean }>>
}
