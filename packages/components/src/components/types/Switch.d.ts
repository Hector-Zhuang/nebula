import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
interface SwitchProps extends StandardProps, FormItemProps {
  /** 是否选中
   * @default false
   */
  checked?: boolean
  /** 设置在 React 非受控状态下，当前是否选中
   * @unique
   */
  defaultChecked?: boolean
  /** 是否禁用
   * @default false
   */
  disabled?: boolean
  /** 样式，有效值：switch, checkbox
   * @default "switch"
   */
  type?: 'switch' | 'checkbox'
  /** switch 的颜色，同 css 的 color
   * @default "#04BE02"
   */
  color?: string
  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   */
  nativeProps?: Record<string, unknown>
  /** 组件名字，用于表单提交获取数据。
   */
  name?: string
  /** 是否为受控组件，为 true 时，checked 会完全受 setData 控制。
   * @default false
   */
  controlled?: string
  /** 无障碍访问，（属性）元素的额外描述
   */
  ariaLabel?: string
  /** checked 改变时触发 change 事件
   */
  onChange?: CommonEventFunction<SwitchProps.onChangeEventDetail>
}
declare namespace SwitchProps {
  interface onChangeEventDetail {
    value: boolean
  }
}
/** 开关选择器
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Text>默认样式</Text>
 *         <Switch checked/>
 *         <Switch/>
 *         <Text>推荐展示样式</Text>
 *         <Switch checked/>
 *         <Switch/>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class='components-page'>
 *     <text>默认样式</text>
 *     <switch :checked="true" />
 *     <switch />
 *     <text>推荐展示样式</text>
 *     <switch :checked="true" />
 *     <switch />
 *   </view>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/switch.html
 */
declare const Switch: ComponentType<SwitchProps>
export { Switch, SwitchProps }
