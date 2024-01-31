import { TypeComponentExploreProgramCard } from 'types/contentful-types'
import Section from 'pres/common/components/section'
import ProgramCategory from './program-category'

interface Props {
  content: Array<TypeComponentExploreProgramCard>
  title: string
}

function ExplorePrograms({ content, title }: Props) {
  return (
    <Section id="explore-programs" className="container mb-5" pY={true}>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-5 text-h2 fw-bold">{title}</h2>
        </div>
      </div>
      <div className="row g3">
        {content.map(({ fields }, index) => (
          <ProgramCategory key={`explore-program-card-${index}`} {...fields} />
        ))}
      </div>
    </Section>
  )
}

export default ExplorePrograms
