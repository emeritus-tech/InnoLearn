import { Html, Head, Main, NextScript } from 'next/document'
import { preconnectLinks } from 'constants/preconnectLinks'

export default function Document() {
  return (
    <Html>
      <Head>
        {preconnectLinks.map((preconnectLink, index) => (
          <link key={index} {...preconnectLink} />
        ))}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
