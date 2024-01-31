import { Program, ConsentResult } from '@emeritus-engineering/ee-api'

export interface ProgramData extends Omit<Program, 'school'> {
  current_enrollable_course_run?: CurrentEnrollableCourseRun
  show_original_price?: boolean
  brochure?: string
  inbound_phone_numbers?: Array<any>
  gtm_tag_id?: string
  friend_reward_amount?: number
  enrollable_courses?: Array<any>
  programConsent?: ConsentResult
  number_formatting_localized_enabled?: boolean
  advocate_reward_amount?: number
  incentivized_referrals_enabled?: boolean
  landing_pages?: {
    id: number
    program_sfid: string
    published: boolean
    hero_image: string
    hero_image_mobile: string
  }[]
}

export interface CurrentEnrollableCourseRun extends ProgramData {
  b2b__c?: boolean
  currency?: string
  last_date_to_enroll?: string
  payment_plans?: Array<any>
  product__c?: string
  rounds?: Array<any>
  price_in_program_currency_for_admin?: number
  application_fee_in_program_currency?: number
  relative_end_day_from_batch_start?: string
  tuition_discount?: string
}
