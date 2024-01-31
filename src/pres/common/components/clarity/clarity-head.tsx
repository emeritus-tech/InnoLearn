import Script from 'next/script'

function ClarityHead() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return <script />
  }

  return (
    <Script id="clarity_slp" strategy="lazyOnload">
      {`       
            (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; 
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "fjj5d705mi"); 
        `}
    </Script>
  )
}

export default ClarityHead
