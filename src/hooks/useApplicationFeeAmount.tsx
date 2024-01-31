import { useEffect, useState } from 'react'
import { ProgramDiscountProp, isValidLiquidVariable, marketingModule } from 'utils/marketingModule'
import { numberFormatter } from 'utils/numberFormatter'

const useApplicationFeeAmount = (
  text: string,
  activeRoundDiscountIsZero: boolean,
  programDiscount: ProgramDiscountProp,
  number_formatting_localized_enabled: boolean | undefined,
  appFee: number,
  currency: string
) => {
  const [applicationFeeAmount, setApplicationFeeAmout] = useState('')

  useEffect(() => {
    const applicationFeeText =
      isValidLiquidVariable(text) && !activeRoundDiscountIsZero
        ? marketingModule(text, '', programDiscount, {}, '', '')
        : appFee && currency
        ? text.replace(
            '{{active_round_application_fee}}',
            currency
              ? numberFormatter({ number: appFee, currency, style: 'currency', userLocaleEnabled: number_formatting_localized_enabled })
              : ''
          )
        : ''
    if (typeof window !== 'undefined') {
      setApplicationFeeAmout(applicationFeeText)
    }
  }, [text, activeRoundDiscountIsZero, programDiscount, number_formatting_localized_enabled, appFee, currency])
  return applicationFeeAmount
}

export default useApplicationFeeAmount
