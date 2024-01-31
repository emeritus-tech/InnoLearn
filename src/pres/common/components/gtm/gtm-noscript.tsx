function GTMNoScript({ gtmID = process.env.NEXT_PUBLIC_GTM_ID }) {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return <noscript />
  }

  return (
    <noscript
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // eslint-disable-next-line max-len
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      }}
    />
  )
}

export default GTMNoScript
