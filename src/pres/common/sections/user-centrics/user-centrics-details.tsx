import Script from 'next/script'

export interface UserCentricDetailsProps {
  usercentricSettingId: string
}

function UserCentricDetails({ usercentricSettingId }: UserCentricDetailsProps) {
  return (
    <Script
      id="usercentrics-cmp"
      src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
      data-version="preview"
      data-settings-id={usercentricSettingId}
      async
    />
  )
}

export default UserCentricDetails
