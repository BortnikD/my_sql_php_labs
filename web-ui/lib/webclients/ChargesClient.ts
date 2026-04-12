import axiosInstance from '@/lib/axiosInstance'
import { ChargeItem } from '@/lib/types'
import { AxiosResponse } from 'axios'

class ChargesClient {

    private static URL = '/charges'

    getAll(): Promise<AxiosResponse<ChargeItem[]>> {
        return axiosInstance.get(ChargesClient.URL)
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ChargesClient()
