import { useCallback, useEffect, useState } from 'react'

function useFetch(fetcher) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true

    fetcher()
      .then((result) => {
        if (active) {
          setData(result)
          setError('')
        }
      })
      .catch((err) => {
        console.error(err)
        if (active) setError('No fue posible cargar la información')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetcher, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { data, loading, error, reload }
}

export default useFetch
