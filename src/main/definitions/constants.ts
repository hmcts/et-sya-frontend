import {
  postcode_Bristol,
  postcode_Glasgow,
  postcode_Leeds,
  postcode_LondonCentral,
  postcode_LondonEast,
  postcode_LondonSouth,
  postcode_Manchester,
  postcode_MidlandsEast,
  postcode_MidlandsWest,
  postcode_Newcastle,
  postcode_Wales,
  postcode_Watford,
} from './postcode';

export const LegacyUrls = {
  ET1: 'https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number',
  ET1_BASE: 'https://et-pet-et1.aat.platform.hmcts.net',
  ET1_APPLY: '/apply',
  ET1_PATH: '/application-number',
  ACAS_EC_URL: 'https://www.acas.org.uk/early-conciliation',
} as const;

export const Views = {
  DOCUMENT_VIEW: 'document-view',
  RESPONSE_FROM_RESPONDENT_VIEW: 'response-from-respondent-view',
} as const;

export const TranslationKeys = {
  COMMON: 'common',
  HOME: 'home',
  CHECKLIST: 'checklist',
  LIP_OR_REPRESENTATIVE: 'lip-or-representative',
  MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE: 'making-claim-as-legal-representative',
  SINGLE_OR_MULTIPLE_CLAIM: 'single-or-multiple-claim',
  ACAS_MULTIPLE_CLAIM: 'acas-multiple',
  ADDRESS_DETAILS: 'address-details',
  DATE_OF_BIRTH: 'date-of-birth',
  SEX_AND_TITLE: 'sex-and-title',
  RETURN_TO_EXISTING: 'return-to-existing',
  TELEPHONE_NUMBER: 'telephone-number',
  UPDATE_PREFERENCE: 'update-preference',
  VALID_ACAS_REASON: 'valid-no-acas-reason',
  STILL_WORKING: 'still-working',
  VIDEO_HEARINGS: 'video-hearings',
  CONTACT_ACAS: 'contact-acas',
  PENSION: 'pension',
  JOB_TITLE: 'job-title',
  START_DATE: 'start-date',
  NOTICE_END: 'notice-end',
  NOTICE_LENGTH: 'notice-length',
  NOTICE_LENGTH_WEEKS: 'notice-length-weeks',
  NOTICE_LENGTH_MONTHS: 'notice-length-months',
  NOTICE_TYPE: 'notice-type',
  PAY: 'pay',
  AVERAGE_WEEKLY_HOURS: 'average-weekly-hours',
  BENEFITS: 'benefits',
  NOTICE_PERIOD: 'notice-period',
  NOTICE_PERIOD_WORKING: 'notice-period-working',
  NOTICE_PERIOD_NO_LONGER_WORKING: 'notice-period-no-longer-working',
  STEPS_TO_MAKING_YOUR_CLAIM: 'steps-to-making-your-claim',
  TYPE_OF_CLAIM: 'type-of-claim',
  REASONABLE_ADJUSTMENTS: 'reasonable-adjustments',
  DOCUMENTS: 'documents',
  COMMUNICATING: 'communicating',
  SUPPORT: 'support',
  COMFORTABLE: 'comfortable',
  TRAVEL: 'travel',
  NEW_JOB: 'new-job',
  NEW_JOB_START_DATE: 'new-job-start-date',
  NEW_JOB_PAY: 'new-job-pay',
  CLAIM_SUBMITTED: 'claim-submitted',
  CHECK_ANSWERS: 'check-your-answers',
  END_DATE: 'end-date',
  PAST_EMPLOYER: 'past-employer',
  CLAIM_TYPE_DISCRIMINATION: 'claim-type-discrimination',
  CLAIM_TYPE_PAY: 'claim-type-pay',
  DESCRIBE_WHAT_HAPPENED: 'describe-what-happened',
  TELL_US_WHAT_YOU_WANT: 'tell-us-what-you-want',
  COMPENSATION: 'compensation',
  TRIBUNAL_RECOMMENDATION: 'tribunal-recommendation',
  WHISTLEBLOWING_CLAIMS: 'whistleblowing-claims',
  LINKED_CASES: 'linked-cases',
  CLAIM_DETAILS_CHECK: 'claim-details-check',
  TASK_LIST_CHECK: 'tasklist-check',
  FORM: 'form',
  RESPONDENT_NAME: 'respondent-name',
  RESPONDENT_ADDRESS: 'respondent-address',
  WORK_ADDRESS: 'work-address',
  ACAS_CERT_NUM: 'acas-cert-num',
  RESPONDENT_DETAILS_CHECK: 'respondent-details-check',
  NO_ACAS_NUMBER: 'no-acas-reason',
  CLAIM_JURISDICTION_SELECTION: 'claim-jurisdiction-selection',
  ENTER_ADDRESS: 'enter-address',
  PLACE_OF_WORK: 'place-of-work',
  COOKIE_PREFERENCES: 'cookie-preferences',
  CLAIMANT_APPLICATIONS: 'claimant-applications',
  CITIZEN_HUB: 'citizen-hub',
  CLAIM_DETAILS: 'claim-details',
  ET1_DETAILS: 'et1-details',
  SIDEBAR_CONTACT_US: 'sidebar-contact-us',
  CITIZEN_HUB_ACKNOWLEDGEMENT: 'acknowledgement-of-claim',
  CITIZEN_HUB_REJECTION: 'rejection-of-claim',
  CITIZEN_HUB_RESPONSE_REJECTION: 'response-rejection',
  CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT: 'response-acknowledgement',
  CITIZEN_HUB_RESPONSE_FROM_RESPONDENT: 'response-from-respondent',
  RESPONDENT_CONTACT_DETAILS: 'respondent-contact-details',
  CONTACT_THE_TRIBUNAL: 'contact-the-tribunal',
  TRIBUNAL_CONTACT_SELECTED: 'contact-the-tribunal-selected',
  APPLICATION_COMPLETE: 'application-complete',
  RESPOND_TO_APPLICATION_COMPLETE: 'respond-to-application-complete',
  WELSH: 'cy',
  CONTACT_APPLICATION: 'contact-application',
  COPY_TO_OTHER_PARTY: 'copy-to-other-party',
  ACCESSIBILITY_STATEMENT: 'accessibility-statement',
  CONTACT_THE_TRIBUNAL_CYA: 'contact-the-tribunal-cya',
  APPLICATION_DETAILS: 'application-details',
  YOUR_APPLICATIONS: 'your-applications',
  RESPOND_TO_APPLICATION: 'respond-to-application',
  RESPONDENT_APPLICATIONS: 'respondent-applications',
  RESPONDENT_APPLICATION_DETAILS: 'respondent-application-details',
  RESPONDENT_SUPPORTING_MATERIAL: 'respondent-supporting-material',
  RESPONDENT_APPLICATION_CYA: 'respondent-application-cya',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_DETAILS: 'notification-details',
  NOTIFICATION_SUBJECTS: 'notification-subjects',
  ALL_JUDGMENTS: 'all-judgments',
  JUDGMENT_DETAILS: 'judgment-details',
  ABOUT_HEARING_DOCUMENTS: 'about-hearing-documents',
  HEARING_DOCUMENT_UPLOAD: 'hearing-document-upload',
  TRIBUNAL_RESPOND_TO_ORDER: 'tribunal-respond-to-order',
  TRIBUNAL_RESPONSE_CYA: 'tribunal-response-cya',
  TRIBUNAL_RESPONSE_COMPLETED: 'tribunal-response-completed',
  BUNDLES_COMPLETED: 'bundles-completed',
  ALL_DOCUMENTS: 'all-documents',
  GENERAL_CORRESPONDENCE_LIST: 'general-correspondence-list',
  GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS: 'general-correspondence-notification-details',
  PREPARE_DOCUMENTS: 'prepare-documents',
  ADDRESS_POSTCODE_SELECT: 'address-postcode-select',
  ADDRESS_POSTCODE_ENTER: 'address-postcode-enter',
  RESPONDENT_POSTCODE_SELECT: 'respondent-postcode-select',
  RESPONDENT_POSTCODE_ENTER: 'respondent-postcode-enter',
  WORK_POSTCODE_SELECT: 'work-postcode-select',
  WORK_POSTCODE_ENTER: 'work-postcode-enter',
  COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER: 'copy-to-other-party-not-system-user',
  TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER: 'tribunal-response-cya-not-system-user',
  CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER: 'contact-the-tribunal-cya-not-system-user',
  STORED_APPLICATION_CONFIRMATION: 'stored-application-confirmation',
  STORED_TO_SUBMIT: 'stored-to-submit',
  BUNDLES_DOCS_FOR_HEARING_CYA: 'bundles-docs-for-hearing-cya',
  AGREEING_DOCUMENTS_FOR_HEARING: 'agreeing-documents-for-hearing',
  RULE92_HOLDING_PAGE: 'rule92-holding-page',
  RESPOND_TO_TRIBUNAL_RESPONSE: 'respond-to-tribunal-response',
  HEARING_DETAILS: 'hearing-details',
} as const;

export const PageUrls = {
  HOME: '/',
  CHECKLIST: '/checklist',
  CLAIM_SAVED: '/your-claim-has-been-saved',
  CLAIM_STEPS: '/steps-to-making-your-claim',
  CLAIM_SUBMITTED: '/your-claim-has-been-submitted',
  RETURN_TO_EXISTING: '/return-to-existing',
  LIP_OR_REPRESENTATIVE: '/lip-or-representative',
  MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE: '/making-claim-as-legal-representative',
  SINGLE_OR_MULTIPLE_CLAIM: '/single-or-multiple-claim',
  ACAS_MULTIPLE_CLAIM: '/do-you-have-an-acas-no-many-resps',
  VALID_ACAS_REASON: '/do-you-have-a-valid-no-acas-reason',
  STILL_WORKING: '/are-you-still-working',
  TYPE_OF_CLAIM: '/type-of-claim',
  NEW_ACCOUNT_LANDING: '/new-account-landing',
  DOB_DETAILS: '/dob-details',
  ADDRESS_DETAILS: '/address-details',
  CONTACT_ACAS: '/contact-acas',
  VIDEO_HEARINGS: '/would-you-want-to-take-part-in-video-hearings',
  TELEPHONE_NUMBER: '/telephone-number',
  SEX_AND_TITLE: '/sex-and-title',
  UPDATE_PREFERENCES: '/how-would-you-like-to-be-updated-about-your-claim',
  JOB_TITLE: '/job-title',
  PAST_EMPLOYER: '/past-employer',
  PENSION: '/pension',
  START_DATE: '/start-date',
  NOTICE_END: '/notice-end',
  NOTICE_LENGTH: '/notice-length',
  NOTICE_TYPE: '/notice-type',
  PAY: '/pay',
  AVERAGE_WEEKLY_HOURS: '/average-weekly-hours',
  BENEFITS: '/benefits',
  NOTICE_PERIOD: '/got-a-notice-period',
  CHECK_ANSWERS: '/check-your-answers',
  PLACE_OF_WORK: '/place-of-work',
  ADDRESS_LOOK_UP: '/address-lookup',
  REASONABLE_ADJUSTMENTS: '/reasonable-adjustments',
  DOCUMENTS: '/documents',
  COMMUNICATING: '/communicating',
  SUPPORT: '/support',
  COMFORTABLE: '/comfortable',
  TRAVEL: '/travel',
  NEW_JOB: '/new-job',
  NEW_JOB_START_DATE: '/new-job-start-date',
  NEW_JOB_PAY: '/new-job-pay',
  END_DATE: '/end-date',
  CLAIM_TYPE_DISCRIMINATION: '/claim-type-discrimination',
  CLAIM_TYPE_PAY: '/claim-type-pay',
  DESCRIBE_WHAT_HAPPENED: '/describe-what-happened',
  TELL_US_WHAT_YOU_WANT: '/tell-us-what-you-want',
  COMPENSATION: '/compensation',
  TRIBUNAL_RECOMMENDATION: '/tribunal-recommendation',
  WHISTLEBLOWING_CLAIMS: '/whistleblowing-claims',
  LINKED_CASES: '/linked-cases',
  PERSONAL_DETAILS_CHECK: '/personal-details-check',
  CLAIM_DETAILS_CHECK: '/claim-details-check',
  RESPONDENT_NAME: '/respondent-name',
  RESPONDENT_ADDRESS: '/respondent-address',
  RESPONDENT_ADDRESS_NON_UK: '/respondent-address-non-uk',
  WORK_ADDRESS: '/work-address',
  ACAS_CERT_NUM: '/acas-cert-num',
  RESPONDENT_DETAILS_CHECK: '/respondent-details-check',
  RESPONDENT_ADD_REDIRECT: '/respondent-add-redirect-check-answer',
  RESPONDENT_REMOVE: '/respondent-remove',
  NO_ACAS_NUMBER: '/no-acas-reason',
  EMPLOYMENT_RESPONDENT_TASK_CHECK: '/employment-respondent-task-check',
  CLAIM_JURISDICTION_SELECTION: '/claim-jurisdiction-selection',
  RESPONDENT_REST_PREFIX: '/respondent/:respondentNumber',
  FIRST_RESPONDENT_NAME: '/respondent/1/respondent-name',
  CLAIMANT_APPLICATIONS: '/claimant-applications',
  SELECTED_APPLICATION: '/claimant-application/:caseId',
  COOKIE_PREFERENCES: '/cookies',
  CITIZEN_HUB: '/citizen-hub/:caseId',
  CLAIM_DETAILS: '/claim-details',
  CITIZEN_HUB_DOCUMENT: '/case-document/:documentType',
  CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT: '/case-document-response-from-respondent',
  RESPONDENT_CONTACT_DETAILS: '/respondent-contact-details',
  GET_CASE_DOCUMENT: '/getCaseDocument/:docId',
  GET_SUPPORTING_MATERIAL: '/getSupportingMaterial/:docId',
  CONTACT_THE_TRIBUNAL: '/contact-the-tribunal',
  TRIBUNAL_CONTACT_SELECTED: '/contact-the-tribunal/:selectedOption',
  REMOVE_FILE: '/remove-tse-file/:application',
  PCQ: '/pcq',
  PCQ_WELSH: '/pcq?lng=cy',
  CONTACT_APPLICATION: '/contact-application',
  COPY_TO_OTHER_PARTY: '/copy-to-other-party',
  CONTACT_THE_TRIBUNAL_CYA: '/contact-the-tribunal-cya',
  APPLICATION_COMPLETE: '/application-complete',
  ACCESSIBILITY_STATEMENT: '/accessibility',
  APPLICATION_DETAILS: '/application-details/:appId',
  RESPOND_TO_APPLICATION_SELECTED: '/respond-to-application/:appId',
  YOUR_APPLICATIONS: '/your-applications',
  RESPONDENT_APPLICATIONS: '/respondent-applications',
  RESPONDENT_APPLICATION_DETAILS: '/respondent-application-details/:appId',
  RESPONDENT_SUPPORTING_MATERIAL: '/respondent-supporting-material/:appId',
  REMOVE_SUPPORTING_MATERIAL: '/remove-supporting-material/:appId',
  RESPOND_TO_APPLICATION_COMPLETE: '/respond-to-application-complete',
  RESPONDENT_APPLICATION_CYA: '/respondent-application-cya',
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_DETAILS: '/notification-details/:orderId',
  ALL_JUDGMENTS: '/all-judgments',
  JUDGMENT_DETAILS: '/judgment-details/:appId',
  GET_TRIBUNAL_ORDER_DOCUMENT: '/getTribunalOrderDocument/:docId',
  ABOUT_HEARING_DOCUMENTS: '/about-hearing-documents',
  HEARING_DOCUMENT_UPLOAD: '/hearing-document-upload/:hearingId',
  HEARING_DOCUMENT_REMOVE: '/hearing-document-remove/:hearingId',
  TRIBUNAL_RESPOND_TO_ORDER: '/tribunal-respond-to-order/:orderId',
  TRIBUNAL_RESPONSE_CYA: '/tribunal-response-cya',
  TRIBUNAL_RESPONSE_COMPLETED: '/tribunal-response-completed',
  BUNDLES_COMPLETED: '/bundles-completed',
  ALL_DOCUMENTS: '/all-documents',
  GENERAL_CORRESPONDENCE_LIST: '/general-correspondence-list',
  GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS: '/general-correspondence-notification-details/:itemId',
  PREPARE_DOCUMENTS: '/prepare-documents',
  RESPONDENT_POSTCODE_SELECT: '/respondent-postcode-select',
  RESPONDENT_POSTCODE_ENTER: '/respondent-postcode-enter',
  WORK_POSTCODE_SELECT: '/work-postcode-select',
  WORK_POSTCODE_ENTER: '/work-postcode-enter',
  ADDRESS_POSTCODE_SELECT: '/address-postcode-select',
  ADDRESS_POSTCODE_ENTER: '/address-postcode-enter',
  // Rule 92 non-system user
  COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER: '/copy-to-other-party-not-system-user',
  CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER: '/contact-the-tribunal-cya-not-system-user',
  TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER: '/tribunal-response-cya-not-system-user',
  STORED_APPLICATION_CONFIRMATION: '/stored-application-confirmation/:appId',
  STORED_RESPONSE_APPLICATION_CONFIRMATION: '/stored-response-application-confirmation/:appId',
  STORED_RESPONSE_TRIBUNAL_CONFIRMATION: '/stored-response-tribunal-confirmation/:orderId',
  STORED_TO_SUBMIT: '/stored-to-submit/:appId',
  STORED_TO_SUBMIT_RESPONSE: '/stored-to-submit-response/:appId/:responseId',
  STORED_TO_SUBMIT_TRIBUNAL: '/stored-to-submit-tribunal/:orderId/:responseId',
  STORED_TO_SUBMIT_COMPLETE: '/stored-to-submit-complete',
  BUNDLES_DOCS_FOR_HEARING_CYA: '/documents-for-hearing',
  AGREEING_DOCUMENTS_FOR_HEARING: '/agreeing-documents-for-hearing',
  RULE92_HOLDING_PAGE: '/holding-page',
  RESPOND_TO_TRIBUNAL_RESPONSE: '/respond-to-tribunal-response/:appId',
  HEARING_DETAILS: '/hearing-details',
} as const;

export const InterceptPaths = {
  CHANGE_DETAILS: '*/change',
  ANSWERS_CHANGE: '/change?redirect=answers',
  RESPONDENT_CHANGE: '/change?redirect=respondent',
  SUBMIT_CASE: '/submitDraftCase',
  REMOVE_FILE: '/remove-uploaded-file',
  SUBMIT_TRIBUNAL_CYA: '/submitTribunalCya',
  SUBMIT_RESPONDENT_CYA: '/submitRespondentCya',
  TRIBUNAL_RESPONSE_SUBMIT_CYA: '/tribunalResponseSubmitCya',
  STORE_TRIBUNAL_CYA: '/storeTribunalCya',
  TRIBUNAL_RESPONSE_STORE_CYA: '/tribunalResponseStoreCya',
  STORE_RESPONDENT_CYA: '/storeRespondentCya',
  SUBMIT_BUNDLES_HEARING_DOCS_CYA: '/submitBundlesHearingDocsCya',
} as const;

export const ErrorPages = {
  NOT_FOUND: '/not-found',
};

export const ValidationErrors = {
  REQUIRED: 'required',
  INVALID_VALUE: 'invalid',
  INVALID_CURRENCY: 'invalidCurrency',
  TOO_HIGH_CURRENCY: 'tooHighCurrency',
} as const;

export const AuthUrls = {
  CALLBACK: '/oauth2/callback',
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const;

export const JavaApiUrls = {
  DOWNLOAD_CLAIM_PDF: '/generate-pdf',
  UPLOAD_FILE: '/documents/upload/',
  DOCUMENT_DOWNLOAD: '/document/download/',
  DOCUMENT_DETAILS: '/document/details/',
  GET_CASES: 'cases/user-cases',
  GET_CASE: 'cases/user-case',
  INITIATE_CASE_DRAFT: 'cases/initiate-case',
  UPDATE_CASE_DRAFT: 'cases/update-case',
  SUBMIT_CASE: 'cases/submit-case',
  UPDATE_CASE_SUBMITTED: 'cases/update-hub-links-statuses',
  RESPOND_TO_APPLICATION: 'cases/respond-to-application',
  CHANGE_APPLICATION_STATUS: 'cases/change-application-status',
  SUBMIT_CLAIMANT_APPLICATION: 'cases/submit-claimant-application',
  STORE_CLAIMANT_APPLICATION: 'store/store-claimant-application',
  STORE_RESPOND_TO_APPLICATION: 'store/store-respond-to-application',
  SUBMIT_STORED_CLAIMANT_APPLICATION: 'store/submit-stored-claimant-application',
  SUBMIT_STORED_RESPOND_TO_APPLICATION: 'store/submit-stored-respond-to-application',
  TRIBUNAL_RESPONSE_VIEWED: 'cases/tribunal-response-viewed',
  ADD_RESPONSE_TO_SEND_NOTIFICATION: '/sendNotification/add-response-send-notification',
  UPDATE_NOTIFICATION_STATE: '/sendNotification/update-notification-state',
  STORE_RESPOND_TO_TRIBUNAL: 'store/store-respond-to-tribunal',
  SUBMIT_STORED_RESPOND_TO_TRIBUNAL: 'store/submit-stored-respond-to-tribunal',
  UPDATE_ADMIN_DECISION_STATE: '/tseAdmin/update-admin-decision-state',
  SUBMIT_BUNDLES: 'bundles/submit-bundles',
} as const;

export const Urls = {
  INFO: '/info',
  DOWNLOAD_CLAIM: '/download-claim',
  PCQ: '/pcq',
  EXTEND_SESSION: '/extend-session',
} as const;

export const HTTPS_PROTOCOL = 'https://';

export const ALLOWED_FILE_FORMATS = [
  'pdf',
  'doc',
  'docx',
  'txt',
  'dot',
  'jpg',
  'jpeg',
  'bmp',
  'tif',
  'tiff',
  'png',
  'pdf',
  'xls',
  'xlt',
  'xla',
  'xlsx',
  'xltx',
  'ppt',
  'pot',
  'pps',
  'ppa',
  'pptx',
  'potx',
  'ppsx',
  'rtf',
  'csv',
];

export const RedisErrors = {
  REDIS_ERROR: 'redisError',
  DISPLAY_MESSAGE: 'Please try again or return later.',
  FAILED_TO_CONNECT: 'Error when attempting to connect to Redis',
  FAILED_TO_SAVE: 'Error when attempting to save to Redis',
  FAILED_TO_RETRIEVE: 'Error when attempting to retrieve value from Redis',
  CLIENT_NOT_FOUND: 'Redis client does not exist',
} as const;

export const CaseApiErrors = {
  FAILED_TO_RETRIEVE_CASE: 'Error when attempting to retrieve draft case from sya-api',
} as const;

export const CcdDataModel = {
  CASE_SOURCE: 'ET1 Online',
} as const;

export const EXISTING_USER = 'existingUser';
export const LOCAL_REDIS_SERVER = '127.0.0.1';
export const CITIZEN_ROLE = 'citizen';
export const TYPE_OF_CLAIMANT = 'Individual';
export const FILE_SIZE_LIMIT = 83886500;

export const inScopeLocations = [].concat(
  postcode_Glasgow,
  postcode_Leeds,
  postcode_Bristol,
  postcode_MidlandsEast,
  postcode_LondonCentral,
  postcode_LondonEast,
  postcode_LondonSouth,
  postcode_Manchester,
  postcode_Newcastle,
  postcode_Watford,
  postcode_Wales,
  postcode_MidlandsWest
);

export const ET3_FORM = 'ET3';
export const ET3_ATTACHMENT = 'ET3 Attachment';
export const ET3_SUPPORTING = 'et3Supporting';

export const et1DocTypes = ['ET1'];
export const acknowledgementOfClaimDocTypes = ['1.1', 'Acknowledgement of Claim'];
export const acceptanceDocTypes = ['1.1', '2.7', '2.8', '7.7', '7.8', '7.8a', 'Acknowledgement of Claim'];
export const rejectionDocTypes = ['Rejection of claim'];
export const responseAcceptedDocTypes = ['2.11', 'Letter 14'];
export const responseRejectedDocTypes = ['2.12', '2.13', '2.14', '2.15', 'Letter 10', 'Letter 11'];
export const et3FormDocTypes = [ET3_FORM];
export const et3AttachmentDocTypes = [ET3_ATTACHMENT];

export const CHANGE = 'Change';

export const languages = {
  WELSH: 'cy',
  ENGLISH: 'en',
  WELSH_LOCALE: '&ui_locales=cy',
  ENGLISH_LOCALE: '&ui_locales=en',
  WELSH_URL_POSTFIX: 'lng=cy',
  WELSH_URL_PARAMETER: '?lng=cy',
  ENGLISH_URL_PARAMETER: '?lng=en',
};

export const Rule92Types = {
  CONTACT: 'Contact',
  RESPOND: 'Respond',
  TRIBUNAL: 'Tribunal',
} as const;

export const Parties = {
  BOTH_PARTIES: 'Both parties',
  CLAIMANT_ONLY: 'Claimant only',
  RESPONDENT_ONLY: 'Respondent only',
} as const;

export const ResponseRequired = {
  YES: 'Yes - view document for details',
  NO: 'No',
} as const;

export const Applicant = {
  CLAIMANT: 'Claimant',
  RESPONDENT: 'Respondent',
  ADMIN: 'Admin',
} as const;

export const AllDocumentTypes = {
  CLAIMANT_CORRESPONDENCE: 'Claimant correspondence',
  ACAS_CERT: 'ACAS Certificate',
  RESPONDENT_CORRESPONDENCE: 'Respondent correspondence',
  TRIBUNAL_CORRESPONDENCE: 'Tribunal correspondence',
  CLAIMANT_HEARING_DOCUMENT: 'Claimant Hearing Document',
  RESPONDENT_HEARING_DOCUMENT: 'Respondent Hearing Document',
} as const;

export type AllDocumentTypeValue = (typeof AllDocumentTypes)[keyof typeof AllDocumentTypes];

export const NotificationSubjects = {
  HEARING: 'Hearing',
  GENERAL_CORRESPONDENCE: 'Other (General correspondence)',
  ORDER_OR_REQUEST: 'Case management orders / requests',
  ECC: 'Employer Contract Claim',
} as const;

export const NoticeOfECC = 'Notice of Employer Contract Claim';

export const DOCUMENT_CONTENT_TYPES = {
  DOCX: ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  XLSX: ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  PPTX: ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  DOC: ['doc', 'application/vnd.ms-word'],
  XLS: ['xls', 'application/vnd.ms-excel'],
  PPT: ['ppt', 'application/vnd.ms-powerpoint'],
  CSV: ['csv', 'text/csv'],
  GZ: ['gz', 'application/gzip'],
  GIF: ['gif', 'image/gif'],
  JPEG: ['jpeg', 'image/jpeg'],
  JPG: ['jpg', 'image/jpeg'],
  MP3: ['mp3', 'audio/mpeg'],
  MP4: ['mp4', 'video/mp4'],
  MPEG: ['mpeg', 'video/mpeg'],
  PNG: ['png', 'image/png'],
  PDF: ['pdf', 'application/pdf'],
  TAR: ['tar', 'application/x-tar'],
  TXT: ['txt', 'text/plain'],
  WAV: ['wav', 'audio/wav'],
  WEBA: ['weba', 'audio/webm'],
  WEBM: ['webm', 'video/webm'],
  WEBP: ['webp', 'image/webp'],
  ZIP: ['zip', 'application/zip'],
  _3GP: ['3gp', 'video/3gpp'],
  _3G2: ['3g2', 'video/3gpp2'],
  _7Z: ['7z', 'application/x-7z-compressed'],
  DOT: ['dot', 'application/msword'],
  BMP: ['bmp', 'image/bmp'],
  TIF: ['tif', 'image/tiff'],
  TIFF: ['tiff', 'image/tiff'],
  XLT: ['xlt', 'application/vnd.ms-excel'],
  XLA: ['xla', 'application/vnd.ms-excel'],
  XLTX: ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
  XLSB: ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
  POT: ['pot', 'application/mspowerpoint'],
  PPS: ['pps', 'application/vnd.ms-powerpoint'],
  PPA: ['ppa', 'application/vnd.ms-powerpoint'],
  POTX: ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
  PPSX: ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
  RTF: ['rtf', 'application/rtf'],
  RTX: ['rtx', 'application/rtf'],
};

export const YES = 'Yes';
export const NO = 'No';

export const TseStatus = {
  OPEN_STATE: 'Open',
  CLOSED_STATE: 'Closed',
  STORED_STATE: 'Stored',
} as const;

export const ResponseStatus = {
  STORED_STATE: 'Stored',
} as const;

export const FEATURE_FLAGS = {
  WELSH: 'welsh-language',
  BUNDLES: 'bundles',
  ECC: 'ecc',
  MUL2: 'MUL2',
} as const;
