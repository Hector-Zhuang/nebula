/**
 * All:
 *   ✔ value
 *   ✔ onChange
 *   ✔ onCancel
 * Selector:
 *   ✔ range
 *   ✔ rangeKey
 *   ✔ disabled
 * MultiSelector:
 *   ✔ range
 *   ✔ rangeKey
 *   ✔ disabled
 *   ✔ onColumnChange
 * Time:
 *   ✔ start
 *   ✔ end
 *   ✔ disabled
 * Date:
 *   ✔ start
 *   ✔ end
 *   ✘ fields
 *   ✔ disabled
 * Region:
 *   ✔ customItem
 *   ✔ disabled
 *
 * @hint Children nested in Picker must support onPress to open the selector.
 */

import * as React from 'react'

import DateSelector from './date'
import MultiSelector from './multiSelector'
import RegionSelector from './region'
import Selector from './selector'
import TimeSelector from './time'

const Picker = (props: any): JSX.Element | null => {
  const { mode = 'selector' } = props

  if (mode === 'selector') {
    return <Selector {...props} />
  }
  if (mode === 'multiSelector') {
    return <MultiSelector {...props} />
  }
  if (mode === 'time') {
    return <TimeSelector {...props} />
  }
  if (mode === 'date') {
    return <DateSelector {...props} />
  }
  if (mode === 'region') {
    return <RegionSelector {...props} />
  }
  return null
}

Picker.displayName = '_Picker'

export default Picker
