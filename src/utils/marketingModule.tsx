import { LIQUID_VARIABLE_INVALID_TEXT } from 'constants/contentful'

export interface ProgramDiscountProp {
  programDiscountVal?: string
  roundActivateDate?: string
  programDiscountAmount?: string
  applicationDiscountAmount?: string
}

interface programDurationProp {
  days?: string
  hours?: string
}
export const isValidLiquidVariable = (text: string) => {
  const liquidPlacholders = [
    'start_date_current_date',
    'extended_deadline_date_with_user_timezone',
    'current_round_tuition_discount_formatted',
    'active_round_end_date',
    'active_round_program_fee',
    'active_round_application_fee',
    'default_program_fee',
    'rounds_end_time',
    'rounds_end_date'
  ]

  //Check Liquid variable present in rich text
  return liquidPlacholders.some((placeholder) => text.includes(placeholder))
}

export const marketingModule = (
  text: string,
  programStartDate?: string,
  programDiscount?: ProgramDiscountProp,
  programDuration?: programDurationProp,
  t?: any,
  defaultProgramFee = ''
) => {
  let updateText = text
  updateText = updateText.replace(/{{|}}/g, '')

  if (text.includes('start_date_current_date')) {
    if (programDuration?.days == '0' || programDuration?.hours == '0') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    if (programDuration?.days) {
      updateText = updateText.replace('start_date_current_date', t('common:days', { value: programDuration?.days }))
    } else if (programDuration?.hours) {
      updateText = updateText.replace('start_date_current_date', t('common:hours', { value: programDuration?.hours }))
    }
  }

  if (text.includes('extended_deadline_date_with_user_timezone')) {
    if (programStartDate == '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('extended_deadline_date_with_user_timezone', programStartDate || LIQUID_VARIABLE_INVALID_TEXT)
  }

  if (text.includes('current_round_tuition_discount_formatted')) {
    if (programDiscount?.programDiscountVal == '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace(
      'current_round_tuition_discount_formatted',
      programDiscount?.programDiscountVal || LIQUID_VARIABLE_INVALID_TEXT
    )
  }

  if (text.includes('active_round_end_date')) {
    if (programDiscount?.roundActivateDate == '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('active_round_end_date', programDiscount?.roundActivateDate || LIQUID_VARIABLE_INVALID_TEXT)
  }

  if (text.includes('active_round_program_fee')) {
    if (programDiscount?.programDiscountAmount == '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('active_round_program_fee', programDiscount?.programDiscountAmount || LIQUID_VARIABLE_INVALID_TEXT)
  }

  if (text.includes('active_round_application_fee')) {
    if (programDiscount?.applicationDiscountAmount == '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace(
      'active_round_application_fee',
      programDiscount?.applicationDiscountAmount || LIQUID_VARIABLE_INVALID_TEXT
    )
  }

  if (text.includes('default_program_fee')) {
    if (defaultProgramFee == '0') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('default_program_fee', defaultProgramFee || LIQUID_VARIABLE_INVALID_TEXT)
  }

  return updateText
}

export const roundApplicationInfo = (
  text: string,
  dateAndtimeObject?: { roundEndTime: string; roundStartDateFormat: string },
  roundsAppFee?: any
) => {
  let updateText = text
  updateText = updateText.replace(/{{|}}/g, '')

  if (text.includes('rounds_end_time')) {
    if (dateAndtimeObject?.roundEndTime === '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('rounds_end_time', dateAndtimeObject?.roundEndTime || '')
  } else {
    updateText = ''
  }

  if (text.includes('rounds_end_date')) {
    if (dateAndtimeObject?.roundStartDateFormat === '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('rounds_end_date', dateAndtimeObject?.roundStartDateFormat || '')
  } else {
    updateText = ''
  }

  if (text.includes('active_round_application_fee')) {
    if (roundsAppFee?.applicationDiscountAmount === '') {
      return LIQUID_VARIABLE_INVALID_TEXT
    }
    updateText = updateText.replace('active_round_application_fee', roundsAppFee || '')
  } else {
    updateText = ''
  }

  return updateText
}
