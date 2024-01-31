import { TypeComponentButton } from 'types/contentful-types'
import ButtonComponent from './button-component'

interface Props {
  content: Array<TypeComponentButton>
}

function ButtonSection({ content }: Props) {
  return (
    <section className="container mb-5 mt-5 d-flex flex-column align-items-center">
      {content.map(({ fields: { text, link, openInNewTab, eventName } }, index) => (
        <ButtonComponent
          key={`button-component-${index}`}
          text={text}
          link={link}
          openInNewTab={openInNewTab}
          eventName={eventName}
          className="btn--large"
        />
      ))}
    </section>
  )
}

export default ButtonSection
