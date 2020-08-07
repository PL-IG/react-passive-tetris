import * as React from 'react'
import { withKnobs, number, select } from '@storybook/addon-knobs'

import PassiveTetris from '../src/PassiveTetris'
import { DefaultColorSet, BlackAndWhiteColorSet, ColorSet } from '../src/ColorSets'

import FullDecorator from '../.storybook/decorators/FullDecorator'

export default {
  title: 'PassiveTetris',
  decorators: [withKnobs, FullDecorator]
}

export const Default = () => {
  return (
    <PassiveTetris />
  )
}

export const Attributes = () => {
  const colorSets = {
    DefaultColorSet: 'Default',
    BlackAndWhiteColorSet: 'Black and White'
  }
  // TODO: fix silly select(...) workaround
  const colorSetsMaps: {[name: string]: ColorSet} = {
    'Default': DefaultColorSet,
    'Black and White': BlackAndWhiteColorSet
  }
  const colorSetLabel = select("colorSet", colorSets, 'Default')
  
  return (
    <PassiveTetris
      sectionPercentages={{
        outer: number('Section Percentages: Outer', 0.33),
        middle: number('Section Percentages: Middle', 0.33)
      }}
      unitSize={number('Unit size', 20)}
      timeStepLength={number('Time Step Length', 50)}
      colorSet={colorSetsMaps[colorSetLabel]}
    />
  )
}
