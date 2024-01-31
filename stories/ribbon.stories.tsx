import { Document } from '@contentful/rich-text-types'
import Ribbon from 'pres/common/sections/ribbon/ribbon'

export default {
  title: 'Example/Ribbon',
  component: Ribbon
}

const ribbonText = { nodeType: 'document', data: {}, content: [{ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: 'Save up to 20% on select courses with code ', marks: [], data: {} }, { nodeType: 'text', value: 'UDEMY5 ', marks: [{ type: 'bold' }], data: {} }, { nodeType: 'text', value: 'through October 31st, 2022.', marks: [], data: {} }] }] } as Document

export const Default = () => (
  <Ribbon ribbonText={ribbonText} />
)
