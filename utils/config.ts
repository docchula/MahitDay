export type RegisterStage = 'register' | 'open' | 'close';

export const REGISTRATION_STAGE: RegisterStage = 'open';
// open: open the website but user cannot register (use when registration is full)
// close: close the website
// register: user can register
export const ALLOW_CERTIFICATE_PRINTING = true; // true or false (REGISTRATION_STAGE should be 'open' before setting to 'true')

export const MAX_MEDTALK_STUDENT = 199; //ตั้ง 199 กันคนลงพร้อมกัน 2 คนเกินเป็น 201
export const MAX_Gross_anatomy = 100;
export const MAX_Histology = 100;
export const MAX_TEAM = 40;
export const RESERVED_TEAM = 10;
