export const leadFormModel = {
  metadata: {
    tags: []
  },
  sys: {
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'formFieldSelect'
      }
    },
    locale: 'en-US'
  },
  fields: {
    contentfulName: 'Lead Field - Program Name',
    label: 'Program Name',
    attributeName: 'program_name',
    fieldType: 'programName',
    required: true,
    optionList: []
  }
}

export const optionData = {
  metadata: {
    tags: []
  },
  sys: {
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'formSelectOptions'
      }
    },
    locale: 'en-US'
  },
  fields: {
    contentfulName: '',
    label: '',
    value: '',
    schoolName: ''
  }
}
