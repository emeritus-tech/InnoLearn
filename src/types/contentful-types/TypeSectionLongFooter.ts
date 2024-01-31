import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentLinkExternalFields } from './TypeComponentLinkExternal'
import type { TypeImageAndLinkFields } from './TypeImageAndLink'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeSectionLongFooterFields {
    contentfulName: EntryFields.Symbol;
    highlightedLinks?: Entry<TypeComponentLinkExternalFields>[];
    seoPrimaryLogo?: Entry<TypeSeoImageFields>;
    seoPrimaryLogoLink?: EntryFields.Symbol;
    seoSecondaryLogo?: Entry<TypeSeoImageFields>;
    seoSecondaryLogoLink?: EntryFields.Symbol;
    body?: EntryFields.RichText;
    socialIconsAndLinks?: Entry<TypeImageAndLinkFields>[];
}

export type TypeSectionLongFooter = Entry<TypeSectionLongFooterFields>;
