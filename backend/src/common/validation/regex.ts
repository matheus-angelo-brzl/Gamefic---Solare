// Regex para permitir apenas caracteres comuns na língua portuguesa
// Bloqueia emojis e caracteres especiais não listados

export const PORTUGUESE_TEXT_REGEX =
  /^[A-Za-z0-9\s.,!?;:()"\-áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]*$/;

export const PORTUGUESE_TEXT_MESSAGE =
  'O campo contém caracteres não permitidos ou emojis';
