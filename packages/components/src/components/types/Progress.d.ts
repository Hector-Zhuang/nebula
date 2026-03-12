import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface ProgressProps extends StandardProps {
  /** 百分比 0~100
   */
  percent?: number
  /** 在进度条右侧显示百分比
   * @default false
   */
  showInfo?: boolean
  /** 圆角大小
   * @default 0
   */
  borderRadius?: number | string
  /** 右侧百分比字体大小
   * @default 16
   */
  fontSize?: number | string
  /** 进度条线的宽度
   * @default 6
   */
  strokeWidth?: number | string
  /** 进度条颜色 (请使用 activeColor)
   * @default "#09BB07"
   */
  color?: string
  /** 已选择的进度条的颜色
   * @default "#09BB07"
   */
  activeColor?: string
  /** 未选择的进度条的颜色
   * @default "#EBEBEB"
   */
  backgroundColor?: string
  /** 进度条从左往右的动画
   * @default false
   */
  active?: boolean
  /** backwards: 动画从头播
   *
   * forwards: 动画从上次结束点接着播
   * @default backwards
   */
  activeMode?: 'backwards' | 'forwards'
  /** 进度增加 1% 所需毫秒数
   * @default 30
   */
  duration?: number
  /** 无障碍访问，（属性）元素的额外描述
   */
  ariaLabel?: string
  /** 动画完成事件
   */
  onActiveEnd?: CommonEventFunction
}
/** 进度条。组件属性的长度单位默认为 px
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
 *         <Progress percent={20} showInfo strokeWidth={2} />
 *         <Progress percent={40} strokeWidth={2} active />
 *         <Progress percent={60}  strokeWidth={2} active />
 *         <Progress percent={80}  strokeWidth={2} active activeColor='blue' />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="components-page">
 *     <progress percent="20" stroke-width="2" :show-info="true" />
 *     <progress percent="40" stroke-width="2" :active="true" />
 *     <progress percent="60" stroke-width="2" :active="true" />
 *     <progress percent="80" stroke-width="2" :active="true" active-color="blue" />
 *   </view>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/progress.html
 */
declare const Progress: ComponentType<ProgressProps>
export { Progress, ProgressProps }
