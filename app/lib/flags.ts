import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(en)

const FIFA_TO_ISO: Record<string, string> = {
  ENG: 'gb-eng',
  WAL: 'gb-wls',
  SCO: 'gb-sct',
  NIR: 'gb-nir',
  GER: 'de',
  ALG: 'dz',
  SUI: 'ch',
  CRC: 'cr',
  PAN: 'pa',
  HON: 'hn',
  JAM: 'jm',
  NZL: 'nz',
  FIJ: 'fj',
  SOL: 'sb',
  TGA: 'to',
  VAN: 'vu',
  PNG: 'pg',
  RSA: 'za',
  CIV: 'ci',
  COD: 'cd',
  UAE: 'ae',
  KSA: 'sa',
  QAT: 'qa',
  IRN: 'ir',
  KOR: 'kr',
  PRK: 'kp',
  CHN: 'cn',
  JPN: 'jp',
  AUS: 'au',
  USA: 'us',
  CAN: 'ca',
  MEX: 'mx',
  ARG: 'ar',
  BRA: 'br',
  URU: 'uy',
  COL: 'co',
  CHI: 'cl',
  ECU: 'ec',
  PER: 'pe',
  PAR: 'py',
  VEN: 've',
  BOL: 'bo',
  GHA: 'gh',
  NGA: 'ng',
  CMR: 'cm',
  SEN: 'sn',
  MAR: 'ma',
  TUN: 'tn',
  EGY: 'eg',
  MLI: 'ml',
  BFA: 'bf',
}

export function getFlagUrl(code?: string | null): string | undefined {
  if (!code) return undefined
  const upperCode = code.toUpperCase()

  const iso2 = FIFA_TO_ISO[upperCode] || countries.alpha3ToAlpha2(upperCode)
  if (!iso2) return undefined

  return `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`
}
