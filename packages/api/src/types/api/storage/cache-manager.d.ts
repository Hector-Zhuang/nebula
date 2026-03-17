import Nebula from '../../index'

declare module '../../index' {
  interface CacheManager {
    
    mode: keyof CacheManager.Mode
    
    origin: string
    
    maxAge: number
    
    state: keyof CacheManager.State
    
    addRule(option: CacheManager.AddRuleOption): string
    
    addRules(option: CacheManager.AddRulesOption): string[]
    
    clearCaches(): void
    
    clearRules(): void
    
    deleteCache(
      
      id: string
    ): void
    
    deleteCaches(
      
      ids: string[]
    ): void
    
    deleteRule(
      
      id: string
    ): void
    
    deleteRules(
      
      ids: string[]
    ): void
    
    match(option: CacheManager.MatchOption): CacheManager.MatchResult
    
    off(
      
      eventName: string,
      
      handler: NebulaGeneral.EventCallback
    ): void
    
    on(
      
      eventName: keyof CacheManager.OnEventName,
      
      handler: NebulaGeneral.EventCallback
    ): void
    
    start(): void
    
    stop(): void
  }

  namespace CacheManager {
    interface Mode {
      
      weakNetwork
      
      always
      
      none
    }
    interface State {
      
      0
      
      1
      
      2
    }
    interface DataSchema {
      
      type: string
      
      value?: string | RegExp | Function | DataRule[]
    }
    interface DataRule {
      
      name: string
      schema: DataSchema | DataSchema[]
    }
    interface RuleObject {
      
      id: string
      
      method: string
      
      url: any
      
      maxAge: number
      
      dataSchema: DataRule[]
    }

    type Rule = string | RegExp | RuleObject

    interface AddRuleOption {
      
      rule: Rule
    }
    interface AddRulesOption {
      
      rules: Rule[]
    }
    interface MatchOption {
      
      evt: any
    }
    interface MatchResult {
      
      ruleId: string
      
      cacheId: string
      
      data: any
      
      createTime: number
      
      maxAge: number
    }
    interface OnEventName {
      
      request
      
      enterWeakNetwork
      
      exitWeakNetwork
    }
  }

  namespace createCacheManager {
    interface Mode {
      
      weakNetwork
      
      always
      
      none
    }
    interface Extra {
      
      apiList?: string[]
    }
    interface Option {
      
      origin?: string
      
      mode?: keyof Mode
      
      maxAge?: number
      
      extra?: Extra
    }
  }

  interface NebulaStatic {
    
    createCacheManager(option: createCacheManager.Option): CacheManager
  }
}
