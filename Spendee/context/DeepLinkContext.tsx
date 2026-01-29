import * as Linking from 'expo-linking'
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'

export const DeepLinkContext = createContext({
  oauthIncoming: false,
  deepParams: {},
})

export function DeepLinkProvider({ children }: PropsWithChildren) {
  const [oauthIncoming, setOauthIncoming] = useState(false)
  const [deepParams, setDeepParams] = useState({})

  useEffect(() => {
    async function checkInitial() {
      try {
        const url = await Linking.getInitialURL()
        if (url) {
          const parsed = Linking.parse(url)
          if (parsed?.queryParams?.isOAuthFlow === 'true') {
            setOauthIncoming(true)
            setDeepParams(parsed.queryParams || {})
          }
        }
      } catch (e) {
        console.warn('deep link check initial failed', e)
      }
    }

    const subscription = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url)
      if (parsed?.queryParams?.isOAuthFlow === 'true') {
        setOauthIncoming(true)
        setDeepParams(parsed.queryParams || {})
      }
    })

    checkInitial()

    return () => subscription.remove()
  }, [])

  return (
    <DeepLinkContext.Provider value={{ oauthIncoming, deepParams }}>
      {children}
    </DeepLinkContext.Provider>
  )
}
