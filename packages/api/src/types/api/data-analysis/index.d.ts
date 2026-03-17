import Nebula from '../../index'

declare module '../../index' {
  namespace getCommonConfig {
    interface Option {
      /** Array of metric keys to fetch. Each string format: configType_tableKey. */
      keys?: string[]
      /** 0: common config mode. 1: experiment mode, equivalent to wx.getExptInfoSync usage and result. */
      mode: 0 | 1
      /** The API is Promise-based. No callback fields are used. */
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      /** Error code. */
      errcode: number
      /** Error message. */
      errmsg: string
      /** Config type: 1 for table type, 2 for key-value type. */
      conf_type: number
      /**
       * Config payload determined by conf_type.
       * When conf_type is 1, conf is a JSON array like "[{xxx},{xxx}]".
       * When conf_type is 2, conf is a JSON object like "{xxxx}".
       */
      conf: string
      /** Expiration time in seconds. 0 means valid for current call only. */
      expire_sec: number
    }
  }

  interface NebulaStatic {
    
     reportMonitor(
      /** Monitoring ID obtained after creating the metric in the mini program admin. */
      name: string,
      /** Reported value. Aggregated results are shown per minute in the mini program admin. */
      value: number,
    ): void

    /** Custom analytics reporting API.
     * Before using, create an event in custom analytics in the mini program admin,
     * and configure the event name and fields.
     * @supported weapp, swan, tt
     * @example
     * ```tsx
    * Nebula.reportAnalytics('purchase', {
     *   price: 120,
     *   color: 'red'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportAnalytics.html
     */
    reportAnalytics(
      /** Event name. */
      eventName: string,
      /** Custom payload where key is the configured field name and value is reported data. */
      data: NebulaGeneral.IAnyObject,
    ): void

    /** Event reporting API.
     * @supported weapp
     * @example
     * ```tsx
    * Nebula.reportEvent('purchase', {
     *   price: 120,
     *   color: 'red'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportEvent.html
     */
    reportEvent(
      /** Event name. */
      eventId: string,
      /** Custom payload where key is the configured field name and value is reported data. */
      data: NebulaGeneral.IAnyObject,
    ): void

    /** Get experiment parameter values for the given parameter keys.
     * @supported weapp
     * @example
     * ```tsx
    * Nebula.getExptInfoSync(['color'])
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.getExptInfoSync.html
     */
    getExptInfoSync(
      /** Experiment parameter keys. Omit to fetch all experiment parameters. */
      keys?: Array<string>
    ): NebulaGeneral.IAnyObject

    /** Get common config values for the given parameter keys.
     * @supported weapp
     * @example
     * ```tsx
    * Nebula.getCommonConfig({
     *   keys:["key1", "key2"],
     *   mode: 0,
     *   success: (res) => {
     *     console.log("success")
     *     console.log(res)
     *   },
     *   fail: (res) => {
     *     console.log("fail")
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.getCommonConfig.html
     */
    getCommonConfig(
      option: getCommonConfig.Option
    ): Promise<getCommonConfig.SuccessCallbackResult>
  }
}
