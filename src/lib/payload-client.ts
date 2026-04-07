
import { getPayload } from 'payload'
import config from '@payload-config'

// Util to get payload instance
export const getPayloadClient = async () => {
    return await getPayload({ config })
}
