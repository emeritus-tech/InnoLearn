import Script from 'next/script'

export interface CookieBotHeadProps {
  cookieBotId: string
}

function CookieBotHead({ cookieBotId }: CookieBotHeadProps) {
  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={cookieBotId}
      data-blockingmode="auto"
      type="text/javascript"
      strategy="lazyOnload"
    />
  )
}

export default CookieBotHead
