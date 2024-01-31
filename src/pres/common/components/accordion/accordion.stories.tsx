import { BluePrintAccordion } from '@emeritus-engineering/blueprint-core-components/blueprint-accordion'

export default {
  title: 'Example/Accordion',
  component: BluePrintAccordion
}

export const Default = () => (
  <>
    <BluePrintAccordion title="Test Accordion Title #1" content="Test Accordion Body #1" />
    <BluePrintAccordion title="Test Accordion Title #2" content="Test Accordion Body #2" />
    <BluePrintAccordion title="Test Accordion Title #3" content="Test Accordion Body #3" />
    <BluePrintAccordion title="Test Accordion Title #4" content="Test Accordion Body #4" />
  </>
)
