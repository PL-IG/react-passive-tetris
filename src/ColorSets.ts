import { Colors, BlackAndWhiteColors } from './Colors';

export type ColorSet = {
  square: Colors

  straight: Colors

  j: Colors
  l: Colors

  s: Colors
  z: Colors

  t: Colors
}

export const DefaultColorSet: ColorSet = {
  straight: ['rgb(214,30,60)', 'rgb(241,108,107)', 'rgb(236,42,75)'],

  square: ['rgb(59,84,165)', 'rgb(118,137,196)', 'rgb(79,111,182)'],

  j: ['rgb(220,159,39)', 'rgb(246,197,100)', 'rgb(242,181,42)'],
  l: ['rgb(158,35,126)', 'rgb(193,111,173)', 'rgb(179,63,151)'],

  s: ['rgb(236,94,36)', 'rgb(234,154,84)', 'rgb(228,126,37)'],
  z: ['rgb(88,178,71)', 'rgb(150,204,110)', 'rgb(115,191,68)'],

  t: ['rgb(62,170,212)', 'rgb(120,205,244)', 'rgb(54,192,240)']
}

export const BlackAndWhiteColorSet: ColorSet = {
  straight: BlackAndWhiteColors,
  square: BlackAndWhiteColors,
  j: BlackAndWhiteColors,
  l: BlackAndWhiteColors,
  s: BlackAndWhiteColors,
  z: BlackAndWhiteColors,
  t: BlackAndWhiteColors
}