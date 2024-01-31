import Script from 'next/script'

function GTMHead({ gtmID = process.env.NEXT_PUBLIC_GTM_ID, speedCurveLabel = 'Contentful Pages' }) {
  if (!gtmID && process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return <script />
  }

  return (
    <Script id="google-tag-manager" strategy="lazyOnload">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.defer=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmID}');

        setTimeout(function(){
          if (typeof window !== 'undefined' && typeof window.LUX !== 'undefined') {
          window.LUX.label = '${speedCurveLabel}'
        }},500);
      `}
    </Script>
  )
}

export default GTMHead
