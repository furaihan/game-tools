import type { RiverGenParams } from '../types/river-generator'
import { generateRiversCore } from '../core/index'
import { getErrorMessage } from '@/shared/utils/utils'

self.onmessage = (e: MessageEvent<RiverGenParams>) => {
  const params = e.data

  try {
    const result = generateRiversCore(params, (status) => {
      self.postMessage({ type: 'status', status })
    })

    self.postMessage({ type: 'success', data: result })
  } catch (err: unknown) {
    self.postMessage({ type: 'error', error: getErrorMessage(err) })
  }
}
