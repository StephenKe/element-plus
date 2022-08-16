import { useGlobalConfig } from '../use-global-config'

export const useFetch = () => {
  const axios = useGlobalConfig('axios')
  return {
    axios,
  }
}
