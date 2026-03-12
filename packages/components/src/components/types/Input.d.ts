import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
interface InputProps extends StandardProps, FormItemProps {
  /** 输入框的初始内容
   */
  value?: string
  /** 设置 React 非受控输入框的初始内容
   * @unique
   */
  defaultValue?: string
  /** input 的类型
   * @default "text"
   */
  type?: keyof InputProps.Type
  /** 是否是密码类型
   * @default false
   */
  password?: boolean
  /** 输入框为空时占位符
   */
  placeholder?: string
  /** 指定 placeholder 的样式
   */
  placeholderStyle?: string
  /** 指定 placeholder 的样式类
   * @default "input-placeholder"
   */
  placeholderClass?: string
  /** 指定 placeholder 的文本颜色
   */
  placeholderTextColor?: string
  /** 是否禁用
   * @default false
   */
  disabled?: boolean
  /** 最大输入长度，设置为 -1 的时候不限制最大长度
   * @default 140
   */
  maxlength?: number
  /** 指定光标与键盘的距离，单位 px 。取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离
   * @default 0
   */
  cursorSpacing?: number
  /** (即将废弃，请直接使用 focus )自动聚焦，拉起键盘
   * @default false
   * @deprecated
   */
  autoFocus?: boolean
  /** 获取焦点
   * @default false
   */
  focus?: boolean
  /** 设置键盘右下角按钮的文字，仅在type='text'时生效
   * @alipay confirm-type 与 enableNative 属性冲突，若希望 confirm-type 生效，enableNative 不能设定为 false，而且不能设定 always-system
   * @default done
   */
  confirmType?: keyof InputProps.ConfirmType
  /** 点击键盘右下角按钮时是否保持键盘不收起
   * @default false
   */
  confirmHold?: boolean
  /** 指定focus时的光标位置
   */
  cursor?: number
  /** 光标颜色。iOS 下的格式为十六进制颜色值 #000000，安卓下的只支持 default 和 green，Skyline 下无限制
   */
  cursorColor?: string
  /** 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   * @default -1
   */
  selectionStart?: number
  /** 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   * @default -1
   */
  selectionEnd?: number
  /** 键盘弹起时，是否自动上推页面
   * @default true
   */
  adjustPosition?: boolean
  /** focus 时，点击页面的时候不收起键盘
   * @default false
   */
  holdKeyboard?: boolean
  /**
   * 强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效)
   * @default false
   */
  alwaysEmbed?: boolean
  /**
   * 安全键盘加密公钥的路径，只支持包内路径
   */
  safePasswordCertPath?: string
  /**
   * 安全键盘输入密码长度
   */
  safePasswordLength?: number
  /**
   * 安全键盘加密时间戳
   */
  safePasswordTimeStamp?: number
  /**
   * 安全键盘加密盐值
   */
  safePasswordNonce?: string
  /**
   * 安全键盘计算hash盐值，若指定custom-hash 则无效
   */
  safePasswordSalt?: string
  /**
   * 安全键盘计算hash的算法表达式，如 `md5(sha1('foo' + sha256(sm3(password + 'bar'))))`
   */
  safePasswordCustomHash?: string
  /**
   * 当 type 为 number, digit, idcard 数字键盘是否随机排列
   * @default false
   */
  randomNumber?: boolean
  /**
   * 是否为受控组件。为 true 时，value 内容会完全受 setData 控制。
   *
   * 建议当 type 值为 text 时不要将 controlled 设置为 true,详见 [Bugs & Tips](https://opendocs.alipay.com/mini/component/input#Bug%20%26%20Tip)
   * @default false
   */
  controlled?: boolean
  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   */
  nativeProps?: Record<string, unknown>
  /** 组件名字，用于表单提交获取数据。
   */
  name?: string
  /** 是否强制使用系统键盘和 Web-view 创建的 input 元素。为 true 时，confirm-type、confirm-hold 可能失效。
   * @default false
   */
  alwaysSystem?: boolean
  /** 无障碍访问，（属性）元素的额外描述
   */
  ariaLabel?: string
  /** 用于分发目的。取值：0 和 1，其中 0 表示默认，1 表示手机号，需要和留资分发配置一起使用，详情见留资分发配置。
   * @default 0
   */
  clueType?: number
  /** 当键盘输入时，触发input事件，event.detail = {value, cursor, keyCode}，处理函数可以直接 return 一个字符串，将替换输入框的内容。
   */
  onInput?: CommonEventFunction<InputProps.inputEventDetail>
  /** 输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度
   */
  onFocus?: CommonEventFunction<InputProps.inputForceEventDetail>
  /** 输入框失去焦点时触发
   */
  onBlur?: CommonEventFunction<InputProps.inputValueEventDetail>
  /** 点击完成按钮时触发
   */
  onConfirm?: CommonEventFunction<InputProps.inputValueEventDetail>
  /** 键盘高度发生变化的时候触发此事件
   */
  onKeyboardHeightChange?: CommonEventFunction<InputProps.onKeyboardHeightChangeEventDetail>
  /** 用户昵称审核完毕后触发，仅在 type 为 "nickname" 时有效，event.detail = { pass, timeout }
   */
  onNickNameReview?: CommonEventFunction
  /** 选区改变事件, {selectionStart, selectionEnd}
   */
  onSelectionChange?: CommonEventFunction
  /** 输入法开始新的输入时触发 （仅当输入法支持时触发）
   */
  onKeyboardCompositionStart?: CommonEventFunction
  /** 输入法输入字符时触发（仅当输入法支持时触发）
   */
  onKeyboardCompositionUpdate?: CommonEventFunction
  /** 输入法输入结束时触发（仅当输入法支持时触发）
   */
  onKeyboardCompositionEnd?: CommonEventFunction
  /** 键盘高度变化时触发。event.detail = {height: height, pageBottomPadding: pageBottomPadding}； height: 键盘高度，pageBottomPadding: 页面上推高度
   */
  onKeyoardHeightChangeWorklet?: string
}
declare namespace InputProps {
  /** Input 类型 */
  interface Type {
    /** 文本输入键盘
     */
    text
    /** 数字输入键盘
     */
    number
    /** 身份证输入键盘
     */
    idcard
    /** 带小数点的数字键盘
     */
    digit
    /** 密码安全输入键盘[指引](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/safe-password.html)
     */
    'safe-password'
    /** 昵称输入键盘
     */
    nickname
    /** 数字输入键盘
     */
    numberpad
    /** 带小数点的数字键盘
     */
    digitpad
    /** 身份证输入键盘
     */
    idcardpad
  }
  /** Confirm 类型 */
  interface ConfirmType {
    /** 右下角按钮为“发送” */
    send
    /** 右下角按钮为“搜索” */
    search
    /** 右下角按钮为“下一个” */
    next
    /** 右下角按钮为“前往” */
    go
    /** 右下角按钮为“完成” */
    done
  }
  /** > 注意：React-Native 端 `inputEventDetail` 仅实现参数 `value`，若需实时获取光标位置则可通过 [`onSelectionChange`](https://reactnative.dev/docs/textinput#onselectionchange) 实现。 */
  interface inputEventDetail {
    /** 输入值 */
    value: string
    /** 光标位置 */
    cursor: number
    /** 键值 */
    keyCode: number
  }
  interface inputForceEventDetail {
    /** 输入值 */
    value: string
    /** 键盘高度 */
    height: number
  }
  interface inputValueEventDetail {
    /** 输入值 */
    value: string
  }
  interface onKeyboardHeightChangeEventDetail {
    /** 键盘高度 */
    height: number
    /** 持续时间 */
    duration: number
  }
}
/** 输入框。该组件是原生组件，使用时请注意相关限制
 * @example_react
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <View className='example-body'>
 *         <Text>可以自动聚焦的 input</Text>
 *           <Input type='text' placeholder='将会获取焦点' focus/>
 *           <Text>控制最大输入长度的 input</Text>
 *           <Input type='text' placeholder='最大输入长度为 10' maxLength='10'/>
 *           <Text>数字输入的 input</Text>
 *           <Input type='number' placeholder='这是一个数字输入框'/>
 *           <Text>密码输入的 input</Text>
 *           <Input type='password' password placeholder='这是一个密码输入框'/>
 *           <Text>带小数点的 input</Text>
 *           <Input type='digit' placeholder='带小数点的数字键盘'/>
 *           <Text>身份证输入的 input</Text>
 *           <Input type='idcard' placeholder='身份证输入键盘'/>
 *           <Text>控制占位符颜色的 input</Text>
 *           <Input type='text' placeholder='占位符字体是红色的' placeholderStyle='color:red'/>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="example-body">
 *     <text>可以自动聚焦的 input</text>
 *     <input type="text" placeholder="将会获取焦点" :focus="true" />
 *     <text>控制最大输入长度的 input</text>
 *     <input type="text" placeholder="最大输入长度为 10" maxLength="10"/>
 *     <text>数字输入的 input</text>
 *     <input type="number" placeholder="这是一个数字输入框"/>
 *     <text>密码输入的 input</text>
 *     <input type="password" :password="true" placeholder="这是一个密码输入框"/>
 *     <text>带小数点的 input</text>
 *     <input type="digit" placeholder="带小数点的数字键盘"/>
 *     <text>身份证输入的 input</text>
 *     <input type="idcard" placeholder="身份证输入键盘"/>
 *     <text>控制占位符颜色的 input</text>
 *     <input type="text" placeholder="占位符字体是红色的" placeholder-style="color:red;"/>
 *   </view>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/input.html
 */
declare const Input: ComponentType<InputProps>
export { Input, InputProps }
