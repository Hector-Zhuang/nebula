import Nebula from '../../index'

declare module '../../index' {
  interface NebulaStatic {
    /**
     * @supported weapp, h5, rn, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/env/envObj.html
     */
    env: {
      [key: string]: string | undefined
      
      FRAMEWORK: 'react' | 'preact' | 'solid' | 'vue3'
      
      TARO_ENV: 'weapp' | 'h5' | 'rn' | 'swan' | 'alipay' | 'tt' | 'qq' | 'jd' | 'quickapp'
      
      USER_DATA_PATH?: string
    }
  }
}
