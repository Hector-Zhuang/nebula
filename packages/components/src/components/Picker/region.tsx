import AntPicker from '@ant-design/react-native/lib/picker'
import { PickerData } from '@ant-design/react-native/lib/picker/PropsType'
import * as React from 'react'

import { noop } from '../../utils'
import { RegionObj, RegionProps } from './PropsType'
import { regionData } from './regionData'

function formateRegionData(clObj: RegionObj[] = [], customItem?: string, depth = 2): PickerData[] {
  const l = depth
  const obj: PickerData[] = []
  if (customItem) {
    const objClone: PickerData = {
      value: customItem,
      label: customItem
    }
    const panding = { ...objClone }
    let loop = panding
    while (depth-- > 0) {
      loop.children = [{ ...objClone }]
      loop = loop.children[0]
    }
    obj.push(panding)
  }
  for (let i = 0; i < clObj.length; i++) {
    const region: PickerData = {
      value: clObj[i].value,
      label: clObj[i].value,
    }
    if (clObj[i].children) {
      region.children = formateRegionData(clObj[i].children, customItem, l - 1)
    }
    obj.push(region)
  }
  return obj
}

const RegionSelector = (props: RegionProps): JSX.Element => {
  const {
    children,
    disabled,
    onChange = noop,
    onCancel = noop,
    value: incomingValue,
    defaultValue,
    customItem,
    regionData: propRegionData
  } = props

  const [value, setValue] = React.useState<any[]>([])
  const [pValue, setPValue] = React.useState<any[]>([])
  const [isInOnChangeUpdate, setIsInOnChangeUpdate] = React.useState(false)
  const dismissByOkRef = React.useRef(false)

  const formattedRegionData = React.useMemo(() => {
    return formateRegionData(propRegionData || regionData, customItem)
  }, [customItem, propRegionData])

  React.useEffect(() => {
    // eslint-disable-next-line eqeqeq
    const isControlled = incomingValue != undefined
    if (isControlled) {
      if (incomingValue !== pValue) {
        setPValue(incomingValue)
        setValue(incomingValue)
      } else if (isInOnChangeUpdate && incomingValue !== value) {
        setValue(incomingValue)
        setIsInOnChangeUpdate(false)
      }
      return
    }

    if (incomingValue !== pValue) {
      setPValue(incomingValue)
      setValue(defaultValue ?? [])
    }
  }, [defaultValue, incomingValue, isInOnChangeUpdate, pValue, value])

  return (
    // @ts-ignore
    <AntPicker
      data={formattedRegionData}
      value={value}
      onChange={(nextValue: string[]) => {
        let tmp: RegionObj[] = propRegionData || regionData
        const postcode: (string | undefined)[] = []
        const code = nextValue.map((item) => {
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].value === item) {
              const curCode = tmp[i].code
              postcode.push(tmp[i].postcode)
              tmp = tmp[i].children || []
              return curCode
            }
          }
          return undefined
        }).filter(item => !!item)

        const detail: Record<string, any> = { value: nextValue, code }
        if (postcode[2]) {
          detail.postcode = postcode[2]
        }
        setValue(nextValue)
        setIsInOnChangeUpdate(true)
        onChange({ detail })
      }}
      onOk={() => {
        dismissByOkRef.current = true
      }}
      onVisibleChange={(visible: boolean) => {
        if (!visible && !dismissByOkRef.current) {
          onCancel()
        }
        dismissByOkRef.current = false
      }}
      disabled={disabled}
    >
      {children}
    </AntPicker>
  )
}

export default RegionSelector
