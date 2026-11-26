export const FOLD_SECONDS = 7.2;
export const FOLD_REVEAL = 0.68;
export const getFoldSeconds = (berlin: boolean, closing = false) =>
  berlin ? (closing ? 3.6 : FOLD_SECONDS) : closing ? 1.8 : 3.4;

export const WELCOME_SECONDS = 8.4;
