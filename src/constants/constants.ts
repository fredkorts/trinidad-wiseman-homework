export const ROUTES = {
  HOME: '/',
  ARTICLE: '/article',
  TABLE: '/table',
} as const;

export const MEDIA_QUERIES = {
  MOBILE: '(max-width: 959.98px)',
} as const;

export const BRAND_COPY = {
  NAME: 'Trinidad Wiseman',
} as const;

export const NAVIGATION_COPY = {
  HOME: 'Avaleht',
  ARTICLE: 'Artikkel',
  TABLE: 'Tabel',
} as const;

export const MOBILE_HEADER_COPY = {
  OPEN_SIDEBAR: 'Ava külgriba',
  CLOSE_SIDEBAR: 'Sulge külgriba',
} as const;

export const HOME_PAGE_COPY = {
  HEADING_ID: 'welcome',
  TITLE: 'Tere tulemast!',
  DESCRIPTION: 'See on React + TypeScript kodutöö rakenduse avaleht.',
} as const;

export const ARTICLE_PAGE_COPY = {
  LOAD_ERROR: 'Failed to load article',
  INTRO_SECTION_ARIA_LABEL: 'Introduction',
  BODY_SECTION_ARIA_LABEL: 'Body',
} as const;

export const ARTICLE_PAGE_IDS = {
  TITLE: 'article-title',
} as const;

export const TABLE_PAGE_COPY = {
  TITLE: 'NIMEKIRI',
  LOAD_ERROR: 'Failed to load table data',
} as const;

export const TABLE_COLUMN_LABELS = {
  FIRST_NAME: 'Eesnimi',
  LAST_NAME: 'Perekonnanimi',
  SEX: 'Sugu',
  BIRTH_DATE: 'Sünnikuupäev',
  PHONE: 'Telefon',
} as const;

export const TABLE_A11Y_COPY = {
  PAGINATION_ARIA_LABEL: 'Lehekülgede vahetus',
  PREVIOUS_PAGE: 'Eelmine leht',
  NEXT_PAGE: 'Järgmine leht',
  SORT_BUTTON_PREFIX: 'Sorteeri veerg: ',
  SORT_ASC_SUFFIX: ' ▲',
  SORT_DESC_SUFFIX: ' ▼',
  PREVIOUS_ICON: '‹',
  NEXT_ICON: '›',
} as const;

export const API_RESOURCE_IDS = {
  ARTICLE: '972d2b8a',
  TABLE: 'twn-list',
} as const;

export const API_ENDPOINTS = {
  ARTICLE: `https://proovitoo.twn.ee/api/list/${API_RESOURCE_IDS.ARTICLE}`,
  LIST: 'https://proovitoo.twn.ee/api/list',
} as const;

export const QUERY_KEYS = {
  ARTICLE: ['article', API_RESOURCE_IDS.ARTICLE] as const,
  TABLE: ['table', API_RESOURCE_IDS.TABLE] as const,
} as const;

export const SEX_CODES = {
  MALE: 'm',
  FEMALE: 'f',
} as const;

export const SEX_LABELS = {
  MALE: 'Mees',
  FEMALE: 'Naine',
} as const;

export type SexLabel = (typeof SEX_LABELS)[keyof typeof SEX_LABELS];
