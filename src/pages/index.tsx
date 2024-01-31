import useTranslation from 'next-translate/useTranslation'

export default function Home() {
  const { t } = useTranslation('common')
  return <h1>{t('greeting')}</h1>
}
