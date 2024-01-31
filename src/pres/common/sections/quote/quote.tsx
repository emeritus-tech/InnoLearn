import { useMemo } from 'react'
import { BluePrintQuoteModule } from '@emeritus-engineering/blueprint-core-modules/quote'
import { Entry } from 'contentful'
import { parseToSectionId } from 'utils/common'
import Section from 'pres/common/components/section'
import { TypeComponentQuoteFields } from 'types/contentful-types/TypeComponentQuote'
import { TypeSectionModuleFields } from 'types/contentful-types'

export const Quote = ({ content = [], title, backgroundColor }: TypeSectionModuleFields) => {
  const sectionId = useMemo(() => parseToSectionId(title), [title])

  return (
    <Section id={sectionId} pY className="quote-cntr">
      {(content as Entry<TypeComponentQuoteFields>[]).map(
        ({ fields: { speakerName, speakerTitle, speakerImage, speakerSeoImage, quote } }, index) => (
          <BluePrintQuoteModule
            key={index}
            speakerName={speakerName}
            speakerTitle={speakerTitle}
            speakerImage={speakerImage}
            speakerSeoImage={speakerSeoImage}
            quote={quote}
            backgroundColor={backgroundColor}
          />
        )
      )}
    </Section>
  )
}
