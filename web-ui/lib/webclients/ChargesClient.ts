import axiosInstance from '@/lib/axiosInstance'
import {ChargeItem, ChargesStatement, ChargesTotal} from '@/lib/types'
import {AxiosResponse} from 'axios'

class ChargesClient {

    private static URL = '/charges'

    getAll(companyName: string, year: number): Promise<AxiosResponse<ChargeItem[]>> {
        return axiosInstance.get(ChargesClient.URL, {
            params: {company_name: companyName, year}
        })
    }

    getTotal(companyName: string, year: number): Promise<AxiosResponse<ChargesTotal[]>> {
        return axiosInstance.get(`${ChargesClient.URL}/total`, {
            params: {company_name: companyName, year}
        })
    }

    getTotalByYear(year: number): Promise<AxiosResponse<ChargesTotal[]>> {
        return axiosInstance.get(`${ChargesClient.URL}/total-by-year`, {
            params: {year}
        })
    }

    getStatement(year: number): Promise<AxiosResponse<ChargesStatement>> {
        return axiosInstance.get(`${ChargesClient.URL}/statement`, {
            params: {year}
        })
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ChargesClient()
