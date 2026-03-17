import Nebula from "../../index"

declare module '../../index' {
  namespace cloud {
    
    interface CallFunctionResult extends NebulaGeneral.CallbackResult {
      
      result: NebulaGeneral.IAnyObject | string | undefined
      
      errMsg: string
    }
    
    interface IApiParam<T = any> {
      
      config?: IConfig
      
      
      
    }

    // type IApiFunction<T, P extends IApiParam<T>> = (param?: P) => Promise<T>

    
    interface IInitConfig {
      
      env?:
        | string
        | {
            
            database?: string
            
            functions?: string
            
            storage?: string,
          }
      
      traceUser?: boolean
    }
    
    interface IConfig {
      
      env?: string
      
      traceUser?: boolean
    }
    
    interface ICloudAPIParam<T = any> extends IApiParam<T> {
      
      config?: IConfig
    }
    // interface IICloudAPI {
    //   init: (config?: cloud.IInitConfig) => void
    //   [api: string]: (...args: any[]) => any | cloud.IApiFunction<any, any>
    // }
    // interface ICloudService {
    //   name: string

    //   getAPIs: () => { [name: string]: cloud.IApiFunction<any, any> }
    // }
    // interface ICloudServices {
    //   [serviceName: string]: ICloudService
    // }
    // interface ICloudMetaData {
    //   session_id: string
    // }

    
    interface CallFunctionParam extends ICloudAPIParam<CallFunctionResult> {
      
      name: string
      
      data?: NebulaGeneral.IAnyObject
      slow?: boolean
      
      config?: IConfig
      
      
      
    }

    
    interface UploadFileResult extends NebulaGeneral.CallbackResult {
      
      fileID: string
      
      statusCode: number
      
      errMsg: string
    }

    
    interface UploadFileParam extends ICloudAPIParam<UploadFileResult> {
      
      cloudPath: string
      
      filePath: string
      header?: NebulaGeneral.IAnyObject
      
      config?: IConfig
      
      
      
    }

    
    interface DownloadFileResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
      
      statusCode: number
      
      errMsg: string
    }

    
    interface DownloadFileParam extends ICloudAPIParam<DownloadFileResult> {
      
      fileID: string
      cloudPath?: string
      
      config?: IConfig
      
      
      
    }

    
    interface GetTempFileURLResult extends NebulaGeneral.CallbackResult {
      
      fileList: GetTempFileURLResultItem[]
      
      errMsg: string
    }

    
    interface GetTempFileURLResultItem extends NebulaGeneral.CallbackResult {
      
      fileID: string
      
      tempFileURL: string
      maxAge: number
      
      status: number
      
      errMsg: string
    }

    
    interface GetTempFileURLParam extends ICloudAPIParam<GetTempFileURLResult> {
      fileList: string[]
      
      config?: IConfig
      
      
      
    }

    
    interface DeleteFileResult extends NebulaGeneral.CallbackResult {
      
      fileList: DeleteFileResultItem[]
      
      errMsg: string
    }

    
    interface DeleteFileResultItem extends NebulaGeneral.CallbackResult {
      
      fileID: string
      
      status: number
      
      errMsg: string
    }

    
    interface DeleteFileParam extends ICloudAPIParam<DeleteFileResult> {
      
      fileList: string[]
      
      config?: IConfig
      
      
      
    }

    
    interface IOptions {
      
      resourceAppid?: string
      
      resourceEnv: string
    }

    
    interface CallContainerParam < P extends string | NebulaGeneral.IAnyObject | ArrayBuffer = any | any > {
      config?:{
        
        env: string, 
      }
      
      path: string
      
      method?: keyof request.Method
      
      data?: P
      
      header?: NebulaGeneral.IAnyObject
      
      timeout?: number
      
      dataType?: request.DataType
      
      responseType?: keyof {
        text
        arraybuffer
      }
      
      
      
    }

    
    interface CallContainerResult < R extends string | NebulaGeneral.IAnyObject | ArrayBuffer = any | any > {
      
      data: R
      
      header: NebulaGeneral.IAnyObject
      
      statusCode: number
      
      cookies?: NebulaGeneral.IAnyObject
    }
  }

  
  interface cloud {
    
    init(config?: cloud.IInitConfig): void

    
    CloudID(cloudID: string): void

    
    callFunction(param: OQ<cloud.CallFunctionParam>): void
    callFunction(param: RQ<cloud.CallFunctionParam>): Promise<cloud.CallFunctionResult>

    
    uploadFile(param: OQ<cloud.UploadFileParam>): Nebula.UploadTask
    uploadFile(param: RQ<cloud.UploadFileParam>): Promise<cloud.UploadFileResult>

    
    downloadFile(param: OQ<cloud.DownloadFileParam>): DownloadTask
    downloadFile(param: RQ<cloud.DownloadFileParam>): Promise<cloud.DownloadFileResult>

    
    getTempFileURL(param: OQ<cloud.GetTempFileURLParam>): void
    getTempFileURL(param: RQ<cloud.GetTempFileURLParam>): Promise<cloud.GetTempFileURLResult>

    
    deleteFile(param: OQ<cloud.DeleteFileParam>): void
    deleteFile(param: RQ<cloud.DeleteFileParam>): Promise<cloud.DeleteFileResult>

    
    database(config?: cloud.IConfig): DB.Database

    
    Cloud: new (options: cloud.IOptions) => Cloud

    
    callContainer < R = any, P = any >(params: cloud.CallContainerParam<P>): Promise<cloud.CallContainerResult<R>>
  }

  /** @ignore */
  interface Cloud {
      
    init(config?: cloud.IInitConfig): Promise<void>

    
    CloudID(cloudID: string): void

    
    callFunction(param: OQ<cloud.CallFunctionParam>): void
    callFunction(param: RQ<cloud.CallFunctionParam>): Promise<cloud.CallFunctionResult>

    
    uploadFile(param: OQ<cloud.UploadFileParam>): UploadTask
    uploadFile(param: RQ<cloud.UploadFileParam>): Promise<cloud.UploadFileResult>

    
    downloadFile(param: OQ<cloud.DownloadFileParam>): DownloadTask
    downloadFile(param: RQ<cloud.DownloadFileParam>): Promise<cloud.DownloadFileResult>

    
    getTempFileURL(param: OQ<cloud.GetTempFileURLParam>): void
    getTempFileURL(param: RQ<cloud.GetTempFileURLParam>): Promise<cloud.GetTempFileURLResult>

    
    deleteFile(param: OQ<cloud.DeleteFileParam>): void
    deleteFile(param: RQ<cloud.DeleteFileParam>): Promise<cloud.DeleteFileResult>

    
    database(config?: cloud.IConfig): DB.Database

    
     callContainer < R = any, P = any >(params: cloud.CallContainerParam<P>): Promise<cloud.CallContainerResult<R>>
  }

  namespace DB {
    
    interface Database {
      
      readonly config: cloud.IConfig
      
      readonly command: Command
      
      readonly Geo: IGeo
      
      serverDate(options?: Database.ServerDate.IOptions): Database.ServerDate
      
      RegExp(options: Database.IRegExp.IRegExpOptions): Database.IRegExp
      
      collection(collectionName: string): Collection
    }

    namespace Database {
      
      interface ServerDate {
        readonly options: ServerDate.IOptions
      }

      namespace ServerDate {
        interface IOptions {
          offset: number
        }
      }

      
      interface IRegExp {
        readonly regexp: string
        readonly options: string
      }

      namespace IRegExp {
        interface IRegExpOptions {
          regexp: string
          options?: string
        }
      }

      
      interface InternalSymbol {}
    }

    
    interface Collection extends Query {
      
      readonly collectionName: string
      
      readonly database: Database

      
      doc(
        
        docId: string | number
      ): Document

      
      aggregate(): Aggregate

      
      where(condition: Query.IQueryCondition): Collection

      
      limit(value: number): Collection

      
      orderBy(fieldPath: string, string: 'asc' | 'desc'): Collection

      
      skip(offset: number): Collection

      
      field(object: NebulaGeneral.IAnyObject): Collection

      
      get(): Promise<Query.IQueryResult>

      
      count(): Promise<Query.ICountResult>

      
      add(options: OQ<Document.IAddDocumentOptions>): void
      add(options: RQ<Document.IAddDocumentOptions>): Promise<Query.IAddResult>

      
      watch(options: Document.IWatchDocumentOptions): Document.IWatcher
    }

    
    interface Document {
      
      get(options: OQ<Document.IGetDocumentOptions>): void
      get(options: RQ<Document.IGetDocumentOptions>): Promise<Query.IQuerySingleResult>

      
      set(options: OQ<Document.ISetSingleDocumentOptions>): void
      set(options: RQ<Document.ISetSingleDocumentOptions>): Promise<Query.ISetResult>

      
      update(options: OQ<Document.IUpdateSingleDocumentOptions>): void
      update(options: RQ<Document.IUpdateSingleDocumentOptions>): Promise<Query.IUpdateResult>

      
      remove(options: OQ<Document.IRemoveSingleDocumentOptions>): void
      remove(options: RQ<Document.IRemoveSingleDocumentOptions>): Promise<Query.IRemoveResult>
    }

    namespace Document {
      
      type DocumentId = string | number

      
      interface IDocumentData {
        
        _id?: DocumentId
        [key: string]: any
      }

      
      type IDBAPIParam = cloud.IApiParam

      
      interface IAddDocumentOptions extends IDBAPIParam {
        
        data: IDocumentData
        
        config?: cloud.IConfig
        
        
        
      }

      
      interface IWatchDocumentOptions {
        
        onChange?: (res: NebulaGeneral.CallbackResult) => void
        
        onError?: (res: NebulaGeneral.CallbackResult) => void
      }

      
      interface ISnapshot {
        
        docChanges: ChangeEvent[]
        
        docs: NebulaGeneral.IAnyObject[]
        
        type: string
        
        id: number
      }

      
      interface ChangeEvent {
        
        id: number
        
        queueType: keyof QueueType
        
        dataType: keyof DataType
        
        docId: string
        
        doc: NebulaGeneral.IAnyObject
        
        updatedFields: NebulaGeneral.IAnyObject
        
        removedFields: string[]
      }

      
      interface QueueType {
        
        init
        
        update
        
        enqueue
        
        dequeue
      }

      
      interface DataType {
        
        init
        
        update
        
        replace
        
        add
        
        remove
      }

      interface IWatcher {
        
        close(): Promise<any>
      }

      
      type IGetDocumentOptions = IDBAPIParam

      
      type ICountDocumentOptions = IDBAPIParam

      
      interface IUpdateDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
        
        config?: cloud.IConfig
        
        
        
      }

      
      interface IUpdateSingleDocumentOptions extends IDBAPIParam {
        
        data: IUpdateCondition
        
        config?: cloud.IConfig
        
        
        
      }

      
      interface ISetDocumentOptions extends IDBAPIParam {
        
        data: IUpdateCondition
        
        config?: cloud.IConfig
        
        
        
      }

      
      interface ISetSingleDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
        
        config?: cloud.IConfig
        
        
        
      }

      
      interface IRemoveDocumentOptions extends IDBAPIParam {
        query: Query.IQueryCondition
        
        config?: cloud.IConfig
        
        
        
      }

      
      type IRemoveSingleDocumentOptions = IDBAPIParam

      
      interface IUpdateCondition {
        [key: string]: any
      }
    }

    
    interface Query {
      
      where(condition: Query.IQueryCondition): Query

      
      orderBy(fieldPath: string, order: string): Query

      
      limit(max: number): Query

      
      skip(offset: number): Query

      
      field(object: NebulaGeneral.IAnyObject): Query

      
      get(options: OQ<Document.IGetDocumentOptions>): void
      get(options: RQ<Document.IGetDocumentOptions>): Promise<Query.IQueryResult>

      
      count(options: OQ<Document.ICountDocumentOptions>): void
      count(options: RQ<Document.ICountDocumentOptions>): Promise<Query.ICountResult>
    }

    namespace Query {
      interface IQueryCondition {
        [key: string]: any
      }

      type IStringQueryCondition = string

      interface IQueryResult extends NebulaGeneral.CallbackResult {
        
        data: Document.IDocumentData[]
        
        errMsg: string
      }

      interface IQuerySingleResult extends NebulaGeneral.CallbackResult {
        data: Document.IDocumentData
        
        errMsg: string
      }

      interface IAddResult extends NebulaGeneral.CallbackResult {
        _id: Document.DocumentId
        
        errMsg: string
      }

      interface IUpdateResult extends NebulaGeneral.CallbackResult {
        stats: {
          updated: number
          // created: number
        }
        
        errMsg: string
      }

      interface ISetResult extends NebulaGeneral.CallbackResult {
        _id: Document.DocumentId
        stats: {
          updated: number
          created: number
        }
        
        errMsg: string
      }

      interface IRemoveResult extends NebulaGeneral.CallbackResult {
        stats: {
          removed: number,
        }
        
        errMsg: string
      }

      interface ICountResult extends NebulaGeneral.CallbackResult {
        
        total: number
        
        errMsg: string
      }
    }

    
    interface Command {
      
      eq(val: any): Command.DatabaseQueryCommand
      
      neq(val: any): Command.DatabaseQueryCommand
      
      gt(val: any): Command.DatabaseQueryCommand
      
      gte(val: any): Command.DatabaseQueryCommand
      
      lt(val: any): Command.DatabaseQueryCommand
      
      lte(val: any): Command.DatabaseQueryCommand
      
      in(val: any[]): Command.DatabaseQueryCommand
      
      nin(val: any[]): Command.DatabaseQueryCommand

      
      geoNear(options: Command.NearCommandOptions): Command.DatabaseQueryCommand
      
      geoWithin(options: Command.WithinCommandOptions): Command.DatabaseQueryCommand
      
      geoIntersects(
          options: Command.IntersectsCommandOptions,
      ): Command.DatabaseQueryCommand

      
      and(
        ...expressions: Array<Command.DatabaseLogicCommand | Query.IQueryCondition>
      ): Command.DatabaseLogicCommand
      
      or(
        ...expressions: Array<Command.DatabaseLogicCommand | Query.IQueryCondition>
      ): Command.DatabaseLogicCommand

      
      set(val: any): Command.DatabaseUpdateCommand
      
      remove(): Command.DatabaseUpdateCommand
      
      inc(val: number): Command.DatabaseUpdateCommand
      
      mul(val: number): Command.DatabaseUpdateCommand

      
      push(...values: any[]): Command.DatabaseUpdateCommand
      
      pop(): Command.DatabaseUpdateCommand
      
      shift(): Command.DatabaseUpdateCommand
      
      unshift(...values: any[]): Command.DatabaseUpdateCommand
    }

    namespace Command {
      
      interface DatabaseLogicCommand {
        
        fieldName: string | Database.InternalSymbol
        
        operator: keyof LOGIC_COMMANDS_LITERAL | string
        
        operands: any[]

        
        _setFieldName: (fieldName: string) => DatabaseLogicCommand

        
        and(
          ...expressions: Array<DatabaseLogicCommand | Query.IQueryCondition>
        ): DatabaseLogicCommand
        
        or(
          ...expressions: Array<DatabaseLogicCommand | Query.IQueryCondition>
        ): DatabaseLogicCommand
      }

      
      interface DatabaseQueryCommand extends DatabaseLogicCommand {
        
        operator: keyof QUERY_COMMANDS_LITERAL | string

        
        _setFieldName: (fieldName: string) => DatabaseQueryCommand

        
        eq(val: any): DatabaseLogicCommand
        
        neq(val: any): DatabaseLogicCommand
        
        gt(val: any): DatabaseLogicCommand
        
        gte(val: any): DatabaseLogicCommand
        
        lt(val: any): DatabaseLogicCommand
        
        lte(val: any): DatabaseLogicCommand
        
        in(val: any[]): DatabaseLogicCommand
        
        nin(val: any[]): DatabaseLogicCommand

        
        geoNear(options: NearCommandOptions): DatabaseLogicCommand
        
        geoWithin(options: WithinCommandOptions): DatabaseLogicCommand
        
        geoIntersects(
          options: IntersectsCommandOptions,
        ): DatabaseLogicCommand
      }

      
      interface DatabaseUpdateCommand {
        
        fieldName: string | Database.InternalSymbol
        
        operator: keyof UPDATE_COMMANDS_LITERAL
        
        operands: any[]

        
        _setFieldName: (fieldName: string) => DatabaseUpdateCommand
      }

      
      interface LOGIC_COMMANDS_LITERAL {
        
        and: any
        
        or: any
        
        not: any
        
        nor: any
      }

      
      interface QUERY_COMMANDS_LITERAL {
        // normal
        
        eq: any
        
        neq: any
        
        gt: any
        
        gte: any
        
        lt: any
        
        lte: any
        
        in: any
        
        nin: any

        // geo
        
        geoNear: any
        
        geoWithin: any
        
        geoIntersects: any
      }

      
      interface UPDATE_COMMANDS_LITERAL {
        
        set: any
        
        remove: any
        
        inc: any
        
        mul: any
        
        push: any
        
        pop: any
        
        shift: any
        
        unshift: any
      }

      
      interface NearCommandOptions {
        
        geometry: IGeo.GeoPoint
        
        maxDistance?: number
        
        minDistance?: number
      }

      
      interface WithinCommandOptions {
        
        geometry: IGeo.GeoPolygon | IGeo.GeoMultiPolygon
      }

      
      interface IntersectsCommandOptions {
        
        geometry:
          | IGeo.GeoPoint
          | IGeo.GeoMultiPoint
          | IGeo.GeoLineString
          | IGeo.GeoMultiLineString
          | IGeo.GeoPolygon
          | IGeo.GeoMultiPolygon
      }
    }

    
    interface Aggregate {
      
      addFields(object: Object): Aggregate

      
      bucket(object: Object): Aggregate

      
      bucketAuto(object: Object): Aggregate

      
      count(fieldName: string): Aggregate

      
      end(): Promise<Object>

      
      geoNear(options: Object): Aggregate

      
      group(object: Object): Aggregate

      
      limit(value: number): Aggregate

      
      lookup(object: Object): Aggregate

      
      match(object: Object): Aggregate

      
      project(object: Object): Aggregate

      
      replaceRoot(object: Object): Aggregate

      
      sample(size: number): Aggregate

      
      skip(value: number): Aggregate

      
      sort(object: Object): Aggregate

      
      sortByCount(object: Object): Aggregate

      
      unwind(value: string|object): Aggregate
    }

    
    interface IGeo {
      
      Point(longitude: number, latitide: number): IGeo.GeoPoint
      // Point(geojson: IGeo.JSONPoint): IGeo.GeoPoint

      
      LineString(points: IGeo.GeoPoint[] | IGeo.JSONMultiPoint): IGeo.GeoMultiPoint

      
      Polygon(lineStrings: IGeo.GeoLineString[] | IGeo.JSONPolygon): IGeo.GeoPolygon

      
      MultiPoint(polygons: IGeo.GeoPolygon[] | IGeo.JSONMultiPolygon): IGeo.GeoMultiPolygon

      
      MultiLineString(
        lineStrings: IGeo.GeoLineString[] | IGeo.JSONMultiLineString,
      ): IGeo.GeoMultiLineString

      
      MultiPolygon(polygons: IGeo.GeoPolygon[] | IGeo.JSONMultiPolygon): IGeo.GeoMultiPolygon
    }

    namespace IGeo {
      
      interface GeoPoint {
        
        longitude: number
        
        latitude: number

        
        toJSON(): object
        
        toString(): string
      }

      
      interface GeoLineString {
        
        points: GeoPoint[]

        
        toJSON(): JSONLineString
        
        toString(): string
      }

      
      interface GeoPolygon {
        
        lines: GeoLineString[]

        
        toJSON(): JSONPolygon
        
        toString(): string
      }

      
      interface GeoMultiPoint {
        
        points: GeoPoint[]

        
        toJSON(): JSONMultiPoint
        
        toString(): string
      }

      
      interface GeoMultiLineString {
        
        lines: GeoLineString[]

        
        toJSON(): JSONMultiLineString
        
        toString(): string
      }

      
      interface GeoMultiPolygon {
        
        polygons: GeoPolygon[]

        
        toJSON(): JSONMultiPolygon
        
        toString(): string
      }

      
      interface JSONPoint {
        
        type: 'Point'
        
        coordinates: [number, number]
      }

      
      interface JSONLineString {
        
        type: 'LineString'
        
        coordinates: Array<[number, number]>
      }

      
      interface JSONPolygon {
        
        type: 'Polygon'
        
        coordinates: Array<Array<[number, number]>>
      }

      
      interface JSONMultiPoint {
        
        type: 'MultiPoint'
        
        coordinates: Array<[number, number]>
      }

      
      interface JSONMultiLineString {
        
        type: 'MultiLineString'
        
        coordinates: Array<Array<[number, number]>>
      }

      
      interface JSONMultiPolygon {
        
        type: 'MultiPolygon'
        
        coordinates: Array<Array<Array<[number, number]>>>
      }
    }
  }


  interface NebulaStatic {
    cloud: cloud & Cloud
  }
}

type OQ<
  T extends Partial<
    Record<'complete' | 'success' | 'fail', (...args: any[]) => any>
  >
> =
  | (RQ<T> & Required<Pick<T, 'success'>>)
  | (RQ<T> & Required<Pick<T, 'fail'>>)
  | (RQ<T> & Required<Pick<T, 'complete'>>)
  | (RQ<T> & Required<Pick<T, 'success' | 'fail'>>)
  | (RQ<T> & Required<Pick<T, 'success' | 'complete'>>)
  | (RQ<T> & Required<Pick<T, 'fail' | 'complete'>>)
  | (RQ<T> & Required<Pick<T, 'fail' | 'complete' | 'success'>>)

type RQ<
  T extends Partial<
    Record<'complete' | 'success' | 'fail', (...args: any[]) => any>
  >
> = Pick<T, Exclude<keyof T, 'complete' | 'success' | 'fail'>>
