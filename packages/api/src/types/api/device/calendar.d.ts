import Nebula from '../../index'

declare module '../../index' {
  namespace addPhoneRepeatCalendar {
    interface Option {
      
      title: string
      
      startTime: number
      
      allDay?: boolean
      
      description?: string
      
      location?: string
      
      endTime?: string
      
      alarm?: boolean
      
      alarmOffset?: number
      
      repeatInterval?: keyof RepeatInterval
      
      repeatEndTime?: number
      
      
      
    }
    interface RepeatInterval {
      
      day
      
      week
      
      month
      
      year
    }
  }

  namespace addPhoneCalendar {
    interface Option {
      
      title: string
      
      startTime: number
      
      allDay?: boolean
      
      description?: string
      
      location?: string
      
      endTime?: string
      
      alarm?: boolean
      
      alarmOffset?: number
      
      
      
    }
  }

  interface NebulaStatic {
    
    addPhoneRepeatCalendar(option: addPhoneRepeatCalendar.Option): Promise<NebulaGeneral.CallbackResult>
    
    addPhoneCalendar(option: addPhoneCalendar.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
