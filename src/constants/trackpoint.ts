export const trackpointScriptId = 'trackpoint-script'

export const initialRequiredData = {
  requestUUID: 'request_uuid',
  userUUID: 'user_uuid',
  trackEventUUID: 'track_event_uuid',
  requestIDs: 'data-request-ids',
  dataTrackpointMeta: 'data-trackpoint-meta',
  mergeWithPageMeta: 'data-merge-with-paegmeta',
  ccpaOptOut: 'data-ccpa-opt-out'
}

export const programsEvents = {
  showMoreCards: 'show_more_cards',
  programCard: 'program_card',
  closeRibbon: 'close_ribbon'
}

export const exploreCategoryEvents = {
  click: 'click_explore_category'
}

export const partnerLogosEvents = {
  click: 'click_partner_logo'
}

export const headerEvents = {
  primarylLogo: 'primary_logo',
  secondaryLogo: 'secondary_logo',
  logo: 'logo'
}

export const ACTION_TYPES = {
  MODAL: 'modal',
  CTA: 'cta',
  FIELD: 'field',
  INCOMPLETE_FILL: 'incomplete_fill',
  SERVER_FAILURE: 'server_failure',
  URL: 'url',
  SLIDER: 'slider',
  PHONE_NUMBER: 'phone',
  EMAIL: 'email',
  VIDEO_PLAY: 'video_play',
  CTA_MODAL: 'cta_modal'
} as const

export const ACTION_VALUES = {
  OPEN: 'open',
  CLOSE: 'close',
  CONSENT_CHECK: 'consent_check',
  EXPAND: 'expand',
  TEAM_GROUP_INQUIRY: 'team_group_inquiry',
  INDIVIDUAL_INQUIRY: 'individual_inquiry',
  EMAIL: 'email',
  SHOW_MORE: 'show_more'
} as const

export const EVENT_NAME = {
  APPLY_NOW: 'apply_now',
  TEAM_GROUP: 'team_group_form',
  PAYMENT: 'payment_plan',
  LEAD_FORM: 'lead_form',
  LEAD_INITIATED: 'lead_form_submit_initiated',
  LEAD_SUBMITTED: 'lead_submit_successful',
  LEAD_ERROR: 'lead_form_submit_error',
  ACCORDION: 'accordion',
  SPEAKER: 'speaker',
  TESTIMONIAL: 'testimonial',
  LEAD_POP_UP: 'lead_form_pop_up',
  INTERNAL_LINK: 'internal_link',
  EXTERNAL_LINK: 'external_link',
  REFERRAL: 'referral',
  VIDEO: 'video',
  AUTOFILL_COUNTRY: 'landing_page_autofilled_country',
  SEARCH: 'search',
  GENERIC: 'generic',
  PROGRAM_CARD: 'program_card',
  INCENTIVISED_REFERRAL_LINK_GENERATE: 'incentivised_referral_link_generate',
  INCENTIVISED_REFERRALS_PURL_COPY: 'incentivised_referrals_purl_copy',
  INCENTIVISED_REFERRALS_EMAIL_INVITATION: 'incentivised_referrals_email_invitation'
} as const

export const EVENT_SOURCE = {
  CLIENT: 'client',
  SERVER: 'server',
  IP: 'IP'
} as const

export const EVENT_TYPE = {
  FOCUS: 'focus',
  AUTOFILL: 'autofill'
}

export const SECTION_NAMES = {
  SECTION: 'section',
  APPLY_SECTION: 'apply_section',
  STATIC_BAR: 'static_bar',
  STICKY_BAR: 'sticky_bar',
  HERO: 'hero',
  RIBBON: 'ribbon',
  FOOTER: 'footer',
  HEADER: 'header',
  REFERRAL_TOP_BANNER: 'referral_top_banner',
  REFERRAL_BOTTOM_BANNER: 'referral_bottom_banner',
  VIDEO: 'video'
} as const

export const SCREENS = {
  LANDING_PAGE: 'program_page',
  PARTNER_PAGE: 'partner_page',
  THANK_YOU_PAGE: 'thank_you_page',
  B2B_PAGE: 'b2b_company_page',
  COLLECTION_PAGE: 'collection_page',
  SOCIAL_PAGE: 'social_page',
  REFERRAL_PAGE: 'referral_page',
  ELECTIVE_PAGE: 'elective_page',
  ERUDITUS_PAGE: 'eruditus_page'
} as const

export const SECTION_TITLE = {
  INVITE_YOUR_COLLEAGUES: 'invite-your-colleagues',
  INVITE_SENT: 'invite-sent'
}

export const COMPONENT_TITLE = {
  ENTER_YOUR_EMAIL: 'enter-your-email',
  GENERATE_UNIQE_LINK: 'generate-uniqe-link',
  SEND_INVITATION: 'send-invitation',
  COPY_LINK: 'copy-link'
} as const
