
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Vendor
 * 
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>
/**
 * Model ProcurementRequest
 * 
 */
export type ProcurementRequest = $Result.DefaultSelection<Prisma.$ProcurementRequestPayload>
/**
 * Model Quote
 * 
 */
export type Quote = $Result.DefaultSelection<Prisma.$QuotePayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model EmailThread
 * 
 */
export type EmailThread = $Result.DefaultSelection<Prisma.$EmailThreadPayload>
/**
 * Model EmailMessage
 * 
 */
export type EmailMessage = $Result.DefaultSelection<Prisma.$EmailMessagePayload>
/**
 * Model WorkflowExecution
 * 
 */
export type WorkflowExecution = $Result.DefaultSelection<Prisma.$WorkflowExecutionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const RequestStatus: {
  CREATED: 'CREATED',
  QUOTES_REQUESTED: 'QUOTES_REQUESTED',
  QUOTES_RECEIVED: 'QUOTES_RECEIVED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]


export const RequestPriority: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export type RequestPriority = (typeof RequestPriority)[keyof typeof RequestPriority]


export const QuoteSource: {
  EMAIL: 'EMAIL',
  UPLOAD: 'UPLOAD',
  MANUAL: 'MANUAL',
  API: 'API'
};

export type QuoteSource = (typeof QuoteSource)[keyof typeof QuoteSource]


export const QuoteStatus: {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus]


export const PaymentStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const WorkflowStatus: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type WorkflowStatus = (typeof WorkflowStatus)[keyof typeof WorkflowStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type RequestStatus = $Enums.RequestStatus

export const RequestStatus: typeof $Enums.RequestStatus

export type RequestPriority = $Enums.RequestPriority

export const RequestPriority: typeof $Enums.RequestPriority

export type QuoteSource = $Enums.QuoteSource

export const QuoteSource: typeof $Enums.QuoteSource

export type QuoteStatus = $Enums.QuoteStatus

export const QuoteStatus: typeof $Enums.QuoteStatus

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type WorkflowStatus = $Enums.WorkflowStatus

export const WorkflowStatus: typeof $Enums.WorkflowStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organizations
 * const organizations = await prisma.organization.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organizations
   * const organizations = await prisma.organization.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendors
    * const vendors = await prisma.vendor.findMany()
    * ```
    */
  get vendor(): Prisma.VendorDelegate<ExtArgs>;

  /**
   * `prisma.procurementRequest`: Exposes CRUD operations for the **ProcurementRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcurementRequests
    * const procurementRequests = await prisma.procurementRequest.findMany()
    * ```
    */
  get procurementRequest(): Prisma.ProcurementRequestDelegate<ExtArgs>;

  /**
   * `prisma.quote`: Exposes CRUD operations for the **Quote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quotes
    * const quotes = await prisma.quote.findMany()
    * ```
    */
  get quote(): Prisma.QuoteDelegate<ExtArgs>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;

  /**
   * `prisma.emailThread`: Exposes CRUD operations for the **EmailThread** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailThreads
    * const emailThreads = await prisma.emailThread.findMany()
    * ```
    */
  get emailThread(): Prisma.EmailThreadDelegate<ExtArgs>;

  /**
   * `prisma.emailMessage`: Exposes CRUD operations for the **EmailMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailMessages
    * const emailMessages = await prisma.emailMessage.findMany()
    * ```
    */
  get emailMessage(): Prisma.EmailMessageDelegate<ExtArgs>;

  /**
   * `prisma.workflowExecution`: Exposes CRUD operations for the **WorkflowExecution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkflowExecutions
    * const workflowExecutions = await prisma.workflowExecution.findMany()
    * ```
    */
  get workflowExecution(): Prisma.WorkflowExecutionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Organization: 'Organization',
    User: 'User',
    Vendor: 'Vendor',
    ProcurementRequest: 'ProcurementRequest',
    Quote: 'Quote',
    Payment: 'Payment',
    AuditLog: 'AuditLog',
    EmailThread: 'EmailThread',
    EmailMessage: 'EmailMessage',
    WorkflowExecution: 'WorkflowExecution'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "organization" | "user" | "vendor" | "procurementRequest" | "quote" | "payment" | "auditLog" | "emailThread" | "emailMessage" | "workflowExecution"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>
        fields: Prisma.VendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendor>
          }
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>
            result: $Utils.Optional<VendorCountAggregateOutputType> | number
          }
        }
      }
      ProcurementRequest: {
        payload: Prisma.$ProcurementRequestPayload<ExtArgs>
        fields: Prisma.ProcurementRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcurementRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcurementRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>
          }
          findFirst: {
            args: Prisma.ProcurementRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcurementRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>
          }
          findMany: {
            args: Prisma.ProcurementRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>[]
          }
          create: {
            args: Prisma.ProcurementRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>
          }
          createMany: {
            args: Prisma.ProcurementRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProcurementRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>[]
          }
          delete: {
            args: Prisma.ProcurementRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>
          }
          update: {
            args: Prisma.ProcurementRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>
          }
          deleteMany: {
            args: Prisma.ProcurementRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcurementRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProcurementRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcurementRequestPayload>
          }
          aggregate: {
            args: Prisma.ProcurementRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcurementRequest>
          }
          groupBy: {
            args: Prisma.ProcurementRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcurementRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcurementRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ProcurementRequestCountAggregateOutputType> | number
          }
        }
      }
      Quote: {
        payload: Prisma.$QuotePayload<ExtArgs>
        fields: Prisma.QuoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>
          }
          findFirst: {
            args: Prisma.QuoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>
          }
          findMany: {
            args: Prisma.QuoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>[]
          }
          create: {
            args: Prisma.QuoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>
          }
          createMany: {
            args: Prisma.QuoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>[]
          }
          delete: {
            args: Prisma.QuoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>
          }
          update: {
            args: Prisma.QuoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>
          }
          deleteMany: {
            args: Prisma.QuoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotePayload>
          }
          aggregate: {
            args: Prisma.QuoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuote>
          }
          groupBy: {
            args: Prisma.QuoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuoteCountArgs<ExtArgs>
            result: $Utils.Optional<QuoteCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      EmailThread: {
        payload: Prisma.$EmailThreadPayload<ExtArgs>
        fields: Prisma.EmailThreadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailThreadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailThreadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>
          }
          findFirst: {
            args: Prisma.EmailThreadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailThreadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>
          }
          findMany: {
            args: Prisma.EmailThreadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>[]
          }
          create: {
            args: Prisma.EmailThreadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>
          }
          createMany: {
            args: Prisma.EmailThreadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailThreadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>[]
          }
          delete: {
            args: Prisma.EmailThreadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>
          }
          update: {
            args: Prisma.EmailThreadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>
          }
          deleteMany: {
            args: Prisma.EmailThreadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailThreadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmailThreadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailThreadPayload>
          }
          aggregate: {
            args: Prisma.EmailThreadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailThread>
          }
          groupBy: {
            args: Prisma.EmailThreadGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailThreadGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailThreadCountArgs<ExtArgs>
            result: $Utils.Optional<EmailThreadCountAggregateOutputType> | number
          }
        }
      }
      EmailMessage: {
        payload: Prisma.$EmailMessagePayload<ExtArgs>
        fields: Prisma.EmailMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>
          }
          findFirst: {
            args: Prisma.EmailMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>
          }
          findMany: {
            args: Prisma.EmailMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>[]
          }
          create: {
            args: Prisma.EmailMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>
          }
          createMany: {
            args: Prisma.EmailMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>[]
          }
          delete: {
            args: Prisma.EmailMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>
          }
          update: {
            args: Prisma.EmailMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>
          }
          deleteMany: {
            args: Prisma.EmailMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmailMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailMessagePayload>
          }
          aggregate: {
            args: Prisma.EmailMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailMessage>
          }
          groupBy: {
            args: Prisma.EmailMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailMessageCountArgs<ExtArgs>
            result: $Utils.Optional<EmailMessageCountAggregateOutputType> | number
          }
        }
      }
      WorkflowExecution: {
        payload: Prisma.$WorkflowExecutionPayload<ExtArgs>
        fields: Prisma.WorkflowExecutionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowExecutionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowExecutionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>
          }
          findFirst: {
            args: Prisma.WorkflowExecutionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowExecutionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>
          }
          findMany: {
            args: Prisma.WorkflowExecutionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>[]
          }
          create: {
            args: Prisma.WorkflowExecutionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>
          }
          createMany: {
            args: Prisma.WorkflowExecutionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowExecutionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>[]
          }
          delete: {
            args: Prisma.WorkflowExecutionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>
          }
          update: {
            args: Prisma.WorkflowExecutionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>
          }
          deleteMany: {
            args: Prisma.WorkflowExecutionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowExecutionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowExecutionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowExecutionPayload>
          }
          aggregate: {
            args: Prisma.WorkflowExecutionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflowExecution>
          }
          groupBy: {
            args: Prisma.WorkflowExecutionGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowExecutionGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowExecutionCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowExecutionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    users: number
    vendors: number
    requests: number
    quotes: number
    payments: number
    auditLogs: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs
    vendors?: boolean | OrganizationCountOutputTypeCountVendorsArgs
    requests?: boolean | OrganizationCountOutputTypeCountRequestsArgs
    quotes?: boolean | OrganizationCountOutputTypeCountQuotesArgs
    payments?: boolean | OrganizationCountOutputTypeCountPaymentsArgs
    auditLogs?: boolean | OrganizationCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountVendorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcurementRequestWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountQuotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuoteWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    createdRequests: number
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdRequests?: boolean | UserCountOutputTypeCountCreatedRequestsArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcurementRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    quotes: number
  }

  export type VendorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotes?: boolean | VendorCountOutputTypeCountQuotesArgs
  }

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountQuotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuoteWhereInput
  }


  /**
   * Count Type ProcurementRequestCountOutputType
   */

  export type ProcurementRequestCountOutputType = {
    quotes: number
    payments: number
    auditLogs: number
  }

  export type ProcurementRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotes?: boolean | ProcurementRequestCountOutputTypeCountQuotesArgs
    payments?: boolean | ProcurementRequestCountOutputTypeCountPaymentsArgs
    auditLogs?: boolean | ProcurementRequestCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * ProcurementRequestCountOutputType without action
   */
  export type ProcurementRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequestCountOutputType
     */
    select?: ProcurementRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProcurementRequestCountOutputType without action
   */
  export type ProcurementRequestCountOutputTypeCountQuotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuoteWhereInput
  }

  /**
   * ProcurementRequestCountOutputType without action
   */
  export type ProcurementRequestCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * ProcurementRequestCountOutputType without action
   */
  export type ProcurementRequestCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type QuoteCountOutputType
   */

  export type QuoteCountOutputType = {
    payments: number
  }

  export type QuoteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | QuoteCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * QuoteCountOutputType without action
   */
  export type QuoteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuoteCountOutputType
     */
    select?: QuoteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuoteCountOutputType without action
   */
  export type QuoteCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Count Type EmailThreadCountOutputType
   */

  export type EmailThreadCountOutputType = {
    messages: number
  }

  export type EmailThreadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | EmailThreadCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * EmailThreadCountOutputType without action
   */
  export type EmailThreadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThreadCountOutputType
     */
    select?: EmailThreadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EmailThreadCountOutputType without action
   */
  export type EmailThreadCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    logo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    logo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    logo: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganizationMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    logo?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: string
    name: string
    slug: string
    logo: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    logo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Organization$usersArgs<ExtArgs>
    vendors?: boolean | Organization$vendorsArgs<ExtArgs>
    requests?: boolean | Organization$requestsArgs<ExtArgs>
    quotes?: boolean | Organization$quotesArgs<ExtArgs>
    payments?: boolean | Organization$paymentsArgs<ExtArgs>
    auditLogs?: boolean | Organization$auditLogsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    logo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    logo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Organization$usersArgs<ExtArgs>
    vendors?: boolean | Organization$vendorsArgs<ExtArgs>
    requests?: boolean | Organization$requestsArgs<ExtArgs>
    quotes?: boolean | Organization$quotesArgs<ExtArgs>
    payments?: boolean | Organization$paymentsArgs<ExtArgs>
    auditLogs?: boolean | Organization$auditLogsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      vendors: Prisma.$VendorPayload<ExtArgs>[]
      requests: Prisma.$ProcurementRequestPayload<ExtArgs>[]
      quotes: Prisma.$QuotePayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      logo: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Organization$usersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    vendors<T extends Organization$vendorsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$vendorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany"> | Null>
    requests<T extends Organization$requestsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findMany"> | Null>
    quotes<T extends Organization$quotesArgs<ExtArgs> = {}>(args?: Subset<T, Organization$quotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findMany"> | Null>
    payments<T extends Organization$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends Organization$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */ 
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly slug: FieldRef<"Organization", 'String'>
    readonly logo: FieldRef<"Organization", 'String'>
    readonly metadata: FieldRef<"Organization", 'Json'>
    readonly createdAt: FieldRef<"Organization", 'DateTime'>
    readonly updatedAt: FieldRef<"Organization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
  }

  /**
   * Organization.users
   */
  export type Organization$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organization.vendors
   */
  export type Organization$vendorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    cursor?: VendorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Organization.requests
   */
  export type Organization$requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    where?: ProcurementRequestWhereInput
    orderBy?: ProcurementRequestOrderByWithRelationInput | ProcurementRequestOrderByWithRelationInput[]
    cursor?: ProcurementRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProcurementRequestScalarFieldEnum | ProcurementRequestScalarFieldEnum[]
  }

  /**
   * Organization.quotes
   */
  export type Organization$quotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    where?: QuoteWhereInput
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    cursor?: QuoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuoteScalarFieldEnum | QuoteScalarFieldEnum[]
  }

  /**
   * Organization.payments
   */
  export type Organization$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Organization.auditLogs
   */
  export type Organization$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatar: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    orgId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatar: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    orgId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    avatar: number
    role: number
    isActive: number
    orgId: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    isActive?: true
    orgId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    isActive?: true
    orgId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    isActive?: true
    orgId?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: $Enums.UserRole
    isActive: boolean
    orgId: string
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    orgId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    createdRequests?: boolean | User$createdRequestsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    orgId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    orgId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    createdRequests?: boolean | User$createdRequestsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      createdRequests: Prisma.$ProcurementRequestPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      avatar: string | null
      role: $Enums.UserRole
      isActive: boolean
      orgId: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    createdRequests<T extends User$createdRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly orgId: FieldRef<"User", 'String'>
    readonly metadata: FieldRef<"User", 'Json'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.createdRequests
   */
  export type User$createdRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    where?: ProcurementRequestWhereInput
    orderBy?: ProcurementRequestOrderByWithRelationInput | ProcurementRequestOrderByWithRelationInput[]
    cursor?: ProcurementRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProcurementRequestScalarFieldEnum | ProcurementRequestScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  export type VendorMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    website: string | null
    orgId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    website: string | null
    orgId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VendorCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    website: number
    address: number
    orgId: number
    metadata: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VendorMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    website?: true
    orgId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    website?: true
    orgId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VendorCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    website?: true
    address?: true
    orgId?: true
    metadata?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vendors
    **/
    _count?: true | VendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorMaxAggregateInputType
  }

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>
  }




  export type VendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithAggregationInput | VendorOrderByWithAggregationInput[]
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum
    having?: VendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorCountAggregateInputType | true
    _min?: VendorMinAggregateInputType
    _max?: VendorMaxAggregateInputType
  }

  export type VendorGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string | null
    website: string | null
    address: JsonValue | null
    orgId: string
    metadata: JsonValue | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>
        }
      >
    >


  export type VendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    website?: boolean
    address?: boolean
    orgId?: boolean
    metadata?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    quotes?: boolean | Vendor$quotesArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    website?: boolean
    address?: boolean
    orgId?: boolean
    metadata?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    website?: boolean
    address?: boolean
    orgId?: boolean
    metadata?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    quotes?: boolean | Vendor$quotesArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VendorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $VendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vendor"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      quotes: Prisma.$QuotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string | null
      website: string | null
      address: Prisma.JsonValue | null
      orgId: string
      metadata: Prisma.JsonValue | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vendor"]>
    composites: {}
  }

  type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = $Result.GetResult<Prisma.$VendorPayload, S>

  type VendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VendorCountAggregateInputType | true
    }

  export interface VendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vendor'], meta: { name: 'Vendor' } }
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     * 
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorFindManyArgs>(args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     * 
     */
    create<T extends VendorCreateArgs>(args: SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorCreateManyArgs>(args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vendors and returns the data saved in the database.
     * @param {VendorCreateManyAndReturnArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     * 
     */
    delete<T extends VendorDeleteArgs>(args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorUpdateArgs>(args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDeleteManyArgs>(args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorUpdateManyArgs>(args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
    **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorAggregateArgs>(args: Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vendor model
   */
  readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    quotes<T extends Vendor$quotesArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$quotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vendor model
   */ 
  interface VendorFieldRefs {
    readonly id: FieldRef<"Vendor", 'String'>
    readonly name: FieldRef<"Vendor", 'String'>
    readonly email: FieldRef<"Vendor", 'String'>
    readonly phone: FieldRef<"Vendor", 'String'>
    readonly website: FieldRef<"Vendor", 'String'>
    readonly address: FieldRef<"Vendor", 'Json'>
    readonly orgId: FieldRef<"Vendor", 'String'>
    readonly metadata: FieldRef<"Vendor", 'Json'>
    readonly isActive: FieldRef<"Vendor", 'Boolean'>
    readonly createdAt: FieldRef<"Vendor", 'DateTime'>
    readonly updatedAt: FieldRef<"Vendor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor create
   */
  export type VendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>
  }

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor createManyAndReturn
   */
  export type VendorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
  }

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
  }

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput
  }

  /**
   * Vendor.quotes
   */
  export type Vendor$quotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    where?: QuoteWhereInput
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    cursor?: QuoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuoteScalarFieldEnum | QuoteScalarFieldEnum[]
  }

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
  }


  /**
   * Model ProcurementRequest
   */

  export type AggregateProcurementRequest = {
    _count: ProcurementRequestCountAggregateOutputType | null
    _min: ProcurementRequestMinAggregateOutputType | null
    _max: ProcurementRequestMaxAggregateOutputType | null
  }

  export type ProcurementRequestMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: $Enums.RequestStatus | null
    priority: $Enums.RequestPriority | null
    orgId: string | null
    createdBy: string | null
    approvedVendorId: string | null
    approvedQuoteId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    requestedBy: Date | null
    approvedAt: Date | null
    completedAt: Date | null
  }

  export type ProcurementRequestMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: $Enums.RequestStatus | null
    priority: $Enums.RequestPriority | null
    orgId: string | null
    createdBy: string | null
    approvedVendorId: string | null
    approvedQuoteId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    requestedBy: Date | null
    approvedAt: Date | null
    completedAt: Date | null
  }

  export type ProcurementRequestCountAggregateOutputType = {
    id: number
    title: number
    description: number
    items: number
    status: number
    priority: number
    orgId: number
    createdBy: number
    approvedVendorId: number
    approvedQuoteId: number
    metadata: number
    createdAt: number
    updatedAt: number
    requestedBy: number
    approvedAt: number
    completedAt: number
    _all: number
  }


  export type ProcurementRequestMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    orgId?: true
    createdBy?: true
    approvedVendorId?: true
    approvedQuoteId?: true
    createdAt?: true
    updatedAt?: true
    requestedBy?: true
    approvedAt?: true
    completedAt?: true
  }

  export type ProcurementRequestMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    orgId?: true
    createdBy?: true
    approvedVendorId?: true
    approvedQuoteId?: true
    createdAt?: true
    updatedAt?: true
    requestedBy?: true
    approvedAt?: true
    completedAt?: true
  }

  export type ProcurementRequestCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    items?: true
    status?: true
    priority?: true
    orgId?: true
    createdBy?: true
    approvedVendorId?: true
    approvedQuoteId?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    requestedBy?: true
    approvedAt?: true
    completedAt?: true
    _all?: true
  }

  export type ProcurementRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcurementRequest to aggregate.
     */
    where?: ProcurementRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcurementRequests to fetch.
     */
    orderBy?: ProcurementRequestOrderByWithRelationInput | ProcurementRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcurementRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcurementRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcurementRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProcurementRequests
    **/
    _count?: true | ProcurementRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcurementRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcurementRequestMaxAggregateInputType
  }

  export type GetProcurementRequestAggregateType<T extends ProcurementRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateProcurementRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcurementRequest[P]>
      : GetScalarType<T[P], AggregateProcurementRequest[P]>
  }




  export type ProcurementRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcurementRequestWhereInput
    orderBy?: ProcurementRequestOrderByWithAggregationInput | ProcurementRequestOrderByWithAggregationInput[]
    by: ProcurementRequestScalarFieldEnum[] | ProcurementRequestScalarFieldEnum
    having?: ProcurementRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcurementRequestCountAggregateInputType | true
    _min?: ProcurementRequestMinAggregateInputType
    _max?: ProcurementRequestMaxAggregateInputType
  }

  export type ProcurementRequestGroupByOutputType = {
    id: string
    title: string
    description: string | null
    items: JsonValue
    status: $Enums.RequestStatus
    priority: $Enums.RequestPriority
    orgId: string
    createdBy: string
    approvedVendorId: string | null
    approvedQuoteId: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    requestedBy: Date | null
    approvedAt: Date | null
    completedAt: Date | null
    _count: ProcurementRequestCountAggregateOutputType | null
    _min: ProcurementRequestMinAggregateOutputType | null
    _max: ProcurementRequestMaxAggregateOutputType | null
  }

  type GetProcurementRequestGroupByPayload<T extends ProcurementRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcurementRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcurementRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcurementRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ProcurementRequestGroupByOutputType[P]>
        }
      >
    >


  export type ProcurementRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    items?: boolean
    status?: boolean
    priority?: boolean
    orgId?: boolean
    createdBy?: boolean
    approvedVendorId?: boolean
    approvedQuoteId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requestedBy?: boolean
    approvedAt?: boolean
    completedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
    quotes?: boolean | ProcurementRequest$quotesArgs<ExtArgs>
    payments?: boolean | ProcurementRequest$paymentsArgs<ExtArgs>
    auditLogs?: boolean | ProcurementRequest$auditLogsArgs<ExtArgs>
    _count?: boolean | ProcurementRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["procurementRequest"]>

  export type ProcurementRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    items?: boolean
    status?: boolean
    priority?: boolean
    orgId?: boolean
    createdBy?: boolean
    approvedVendorId?: boolean
    approvedQuoteId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requestedBy?: boolean
    approvedAt?: boolean
    completedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["procurementRequest"]>

  export type ProcurementRequestSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    items?: boolean
    status?: boolean
    priority?: boolean
    orgId?: boolean
    createdBy?: boolean
    approvedVendorId?: boolean
    approvedQuoteId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requestedBy?: boolean
    approvedAt?: boolean
    completedAt?: boolean
  }

  export type ProcurementRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
    quotes?: boolean | ProcurementRequest$quotesArgs<ExtArgs>
    payments?: boolean | ProcurementRequest$paymentsArgs<ExtArgs>
    auditLogs?: boolean | ProcurementRequest$auditLogsArgs<ExtArgs>
    _count?: boolean | ProcurementRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProcurementRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProcurementRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProcurementRequest"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      creator: Prisma.$UserPayload<ExtArgs>
      quotes: Prisma.$QuotePayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      items: Prisma.JsonValue
      status: $Enums.RequestStatus
      priority: $Enums.RequestPriority
      orgId: string
      createdBy: string
      approvedVendorId: string | null
      approvedQuoteId: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      requestedBy: Date | null
      approvedAt: Date | null
      completedAt: Date | null
    }, ExtArgs["result"]["procurementRequest"]>
    composites: {}
  }

  type ProcurementRequestGetPayload<S extends boolean | null | undefined | ProcurementRequestDefaultArgs> = $Result.GetResult<Prisma.$ProcurementRequestPayload, S>

  type ProcurementRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProcurementRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProcurementRequestCountAggregateInputType | true
    }

  export interface ProcurementRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProcurementRequest'], meta: { name: 'ProcurementRequest' } }
    /**
     * Find zero or one ProcurementRequest that matches the filter.
     * @param {ProcurementRequestFindUniqueArgs} args - Arguments to find a ProcurementRequest
     * @example
     * // Get one ProcurementRequest
     * const procurementRequest = await prisma.procurementRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcurementRequestFindUniqueArgs>(args: SelectSubset<T, ProcurementRequestFindUniqueArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProcurementRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProcurementRequestFindUniqueOrThrowArgs} args - Arguments to find a ProcurementRequest
     * @example
     * // Get one ProcurementRequest
     * const procurementRequest = await prisma.procurementRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcurementRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcurementRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProcurementRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestFindFirstArgs} args - Arguments to find a ProcurementRequest
     * @example
     * // Get one ProcurementRequest
     * const procurementRequest = await prisma.procurementRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcurementRequestFindFirstArgs>(args?: SelectSubset<T, ProcurementRequestFindFirstArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProcurementRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestFindFirstOrThrowArgs} args - Arguments to find a ProcurementRequest
     * @example
     * // Get one ProcurementRequest
     * const procurementRequest = await prisma.procurementRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcurementRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcurementRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProcurementRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcurementRequests
     * const procurementRequests = await prisma.procurementRequest.findMany()
     * 
     * // Get first 10 ProcurementRequests
     * const procurementRequests = await prisma.procurementRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const procurementRequestWithIdOnly = await prisma.procurementRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcurementRequestFindManyArgs>(args?: SelectSubset<T, ProcurementRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProcurementRequest.
     * @param {ProcurementRequestCreateArgs} args - Arguments to create a ProcurementRequest.
     * @example
     * // Create one ProcurementRequest
     * const ProcurementRequest = await prisma.procurementRequest.create({
     *   data: {
     *     // ... data to create a ProcurementRequest
     *   }
     * })
     * 
     */
    create<T extends ProcurementRequestCreateArgs>(args: SelectSubset<T, ProcurementRequestCreateArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProcurementRequests.
     * @param {ProcurementRequestCreateManyArgs} args - Arguments to create many ProcurementRequests.
     * @example
     * // Create many ProcurementRequests
     * const procurementRequest = await prisma.procurementRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcurementRequestCreateManyArgs>(args?: SelectSubset<T, ProcurementRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProcurementRequests and returns the data saved in the database.
     * @param {ProcurementRequestCreateManyAndReturnArgs} args - Arguments to create many ProcurementRequests.
     * @example
     * // Create many ProcurementRequests
     * const procurementRequest = await prisma.procurementRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProcurementRequests and only return the `id`
     * const procurementRequestWithIdOnly = await prisma.procurementRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProcurementRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, ProcurementRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProcurementRequest.
     * @param {ProcurementRequestDeleteArgs} args - Arguments to delete one ProcurementRequest.
     * @example
     * // Delete one ProcurementRequest
     * const ProcurementRequest = await prisma.procurementRequest.delete({
     *   where: {
     *     // ... filter to delete one ProcurementRequest
     *   }
     * })
     * 
     */
    delete<T extends ProcurementRequestDeleteArgs>(args: SelectSubset<T, ProcurementRequestDeleteArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProcurementRequest.
     * @param {ProcurementRequestUpdateArgs} args - Arguments to update one ProcurementRequest.
     * @example
     * // Update one ProcurementRequest
     * const procurementRequest = await prisma.procurementRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcurementRequestUpdateArgs>(args: SelectSubset<T, ProcurementRequestUpdateArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProcurementRequests.
     * @param {ProcurementRequestDeleteManyArgs} args - Arguments to filter ProcurementRequests to delete.
     * @example
     * // Delete a few ProcurementRequests
     * const { count } = await prisma.procurementRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcurementRequestDeleteManyArgs>(args?: SelectSubset<T, ProcurementRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcurementRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcurementRequests
     * const procurementRequest = await prisma.procurementRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcurementRequestUpdateManyArgs>(args: SelectSubset<T, ProcurementRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProcurementRequest.
     * @param {ProcurementRequestUpsertArgs} args - Arguments to update or create a ProcurementRequest.
     * @example
     * // Update or create a ProcurementRequest
     * const procurementRequest = await prisma.procurementRequest.upsert({
     *   create: {
     *     // ... data to create a ProcurementRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcurementRequest we want to update
     *   }
     * })
     */
    upsert<T extends ProcurementRequestUpsertArgs>(args: SelectSubset<T, ProcurementRequestUpsertArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProcurementRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestCountArgs} args - Arguments to filter ProcurementRequests to count.
     * @example
     * // Count the number of ProcurementRequests
     * const count = await prisma.procurementRequest.count({
     *   where: {
     *     // ... the filter for the ProcurementRequests we want to count
     *   }
     * })
    **/
    count<T extends ProcurementRequestCountArgs>(
      args?: Subset<T, ProcurementRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcurementRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProcurementRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcurementRequestAggregateArgs>(args: Subset<T, ProcurementRequestAggregateArgs>): Prisma.PrismaPromise<GetProcurementRequestAggregateType<T>>

    /**
     * Group by ProcurementRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcurementRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcurementRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcurementRequestGroupByArgs['orderBy'] }
        : { orderBy?: ProcurementRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcurementRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcurementRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProcurementRequest model
   */
  readonly fields: ProcurementRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcurementRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcurementRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    quotes<T extends ProcurementRequest$quotesArgs<ExtArgs> = {}>(args?: Subset<T, ProcurementRequest$quotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findMany"> | Null>
    payments<T extends ProcurementRequest$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, ProcurementRequest$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends ProcurementRequest$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, ProcurementRequest$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProcurementRequest model
   */ 
  interface ProcurementRequestFieldRefs {
    readonly id: FieldRef<"ProcurementRequest", 'String'>
    readonly title: FieldRef<"ProcurementRequest", 'String'>
    readonly description: FieldRef<"ProcurementRequest", 'String'>
    readonly items: FieldRef<"ProcurementRequest", 'Json'>
    readonly status: FieldRef<"ProcurementRequest", 'RequestStatus'>
    readonly priority: FieldRef<"ProcurementRequest", 'RequestPriority'>
    readonly orgId: FieldRef<"ProcurementRequest", 'String'>
    readonly createdBy: FieldRef<"ProcurementRequest", 'String'>
    readonly approvedVendorId: FieldRef<"ProcurementRequest", 'String'>
    readonly approvedQuoteId: FieldRef<"ProcurementRequest", 'String'>
    readonly metadata: FieldRef<"ProcurementRequest", 'Json'>
    readonly createdAt: FieldRef<"ProcurementRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"ProcurementRequest", 'DateTime'>
    readonly requestedBy: FieldRef<"ProcurementRequest", 'DateTime'>
    readonly approvedAt: FieldRef<"ProcurementRequest", 'DateTime'>
    readonly completedAt: FieldRef<"ProcurementRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProcurementRequest findUnique
   */
  export type ProcurementRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProcurementRequest to fetch.
     */
    where: ProcurementRequestWhereUniqueInput
  }

  /**
   * ProcurementRequest findUniqueOrThrow
   */
  export type ProcurementRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProcurementRequest to fetch.
     */
    where: ProcurementRequestWhereUniqueInput
  }

  /**
   * ProcurementRequest findFirst
   */
  export type ProcurementRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProcurementRequest to fetch.
     */
    where?: ProcurementRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcurementRequests to fetch.
     */
    orderBy?: ProcurementRequestOrderByWithRelationInput | ProcurementRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcurementRequests.
     */
    cursor?: ProcurementRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcurementRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcurementRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcurementRequests.
     */
    distinct?: ProcurementRequestScalarFieldEnum | ProcurementRequestScalarFieldEnum[]
  }

  /**
   * ProcurementRequest findFirstOrThrow
   */
  export type ProcurementRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProcurementRequest to fetch.
     */
    where?: ProcurementRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcurementRequests to fetch.
     */
    orderBy?: ProcurementRequestOrderByWithRelationInput | ProcurementRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcurementRequests.
     */
    cursor?: ProcurementRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcurementRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcurementRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcurementRequests.
     */
    distinct?: ProcurementRequestScalarFieldEnum | ProcurementRequestScalarFieldEnum[]
  }

  /**
   * ProcurementRequest findMany
   */
  export type ProcurementRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProcurementRequests to fetch.
     */
    where?: ProcurementRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcurementRequests to fetch.
     */
    orderBy?: ProcurementRequestOrderByWithRelationInput | ProcurementRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProcurementRequests.
     */
    cursor?: ProcurementRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcurementRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcurementRequests.
     */
    skip?: number
    distinct?: ProcurementRequestScalarFieldEnum | ProcurementRequestScalarFieldEnum[]
  }

  /**
   * ProcurementRequest create
   */
  export type ProcurementRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a ProcurementRequest.
     */
    data: XOR<ProcurementRequestCreateInput, ProcurementRequestUncheckedCreateInput>
  }

  /**
   * ProcurementRequest createMany
   */
  export type ProcurementRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcurementRequests.
     */
    data: ProcurementRequestCreateManyInput | ProcurementRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcurementRequest createManyAndReturn
   */
  export type ProcurementRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProcurementRequests.
     */
    data: ProcurementRequestCreateManyInput | ProcurementRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProcurementRequest update
   */
  export type ProcurementRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a ProcurementRequest.
     */
    data: XOR<ProcurementRequestUpdateInput, ProcurementRequestUncheckedUpdateInput>
    /**
     * Choose, which ProcurementRequest to update.
     */
    where: ProcurementRequestWhereUniqueInput
  }

  /**
   * ProcurementRequest updateMany
   */
  export type ProcurementRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcurementRequests.
     */
    data: XOR<ProcurementRequestUpdateManyMutationInput, ProcurementRequestUncheckedUpdateManyInput>
    /**
     * Filter which ProcurementRequests to update
     */
    where?: ProcurementRequestWhereInput
  }

  /**
   * ProcurementRequest upsert
   */
  export type ProcurementRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the ProcurementRequest to update in case it exists.
     */
    where: ProcurementRequestWhereUniqueInput
    /**
     * In case the ProcurementRequest found by the `where` argument doesn't exist, create a new ProcurementRequest with this data.
     */
    create: XOR<ProcurementRequestCreateInput, ProcurementRequestUncheckedCreateInput>
    /**
     * In case the ProcurementRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcurementRequestUpdateInput, ProcurementRequestUncheckedUpdateInput>
  }

  /**
   * ProcurementRequest delete
   */
  export type ProcurementRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    /**
     * Filter which ProcurementRequest to delete.
     */
    where: ProcurementRequestWhereUniqueInput
  }

  /**
   * ProcurementRequest deleteMany
   */
  export type ProcurementRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcurementRequests to delete
     */
    where?: ProcurementRequestWhereInput
  }

  /**
   * ProcurementRequest.quotes
   */
  export type ProcurementRequest$quotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    where?: QuoteWhereInput
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    cursor?: QuoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuoteScalarFieldEnum | QuoteScalarFieldEnum[]
  }

  /**
   * ProcurementRequest.payments
   */
  export type ProcurementRequest$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * ProcurementRequest.auditLogs
   */
  export type ProcurementRequest$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * ProcurementRequest without action
   */
  export type ProcurementRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
  }


  /**
   * Model Quote
   */

  export type AggregateQuote = {
    _count: QuoteCountAggregateOutputType | null
    _avg: QuoteAvgAggregateOutputType | null
    _sum: QuoteSumAggregateOutputType | null
    _min: QuoteMinAggregateOutputType | null
    _max: QuoteMaxAggregateOutputType | null
  }

  export type QuoteAvgAggregateOutputType = {
    totalAmount: Decimal | null
    deliveryDays: number | null
    confidence: number | null
  }

  export type QuoteSumAggregateOutputType = {
    totalAmount: Decimal | null
    deliveryDays: number | null
    confidence: number | null
  }

  export type QuoteMinAggregateOutputType = {
    id: string | null
    orgId: string | null
    requestId: string | null
    vendorId: string | null
    totalAmount: Decimal | null
    currency: string | null
    deliveryDays: number | null
    validUntil: Date | null
    source: $Enums.QuoteSource | null
    confidence: number | null
    status: $Enums.QuoteStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuoteMaxAggregateOutputType = {
    id: string | null
    orgId: string | null
    requestId: string | null
    vendorId: string | null
    totalAmount: Decimal | null
    currency: string | null
    deliveryDays: number | null
    validUntil: Date | null
    source: $Enums.QuoteSource | null
    confidence: number | null
    status: $Enums.QuoteStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuoteCountAggregateOutputType = {
    id: number
    orgId: number
    requestId: number
    vendorId: number
    items: number
    totalAmount: number
    currency: number
    deliveryDays: number
    validUntil: number
    terms: number
    source: number
    rawData: number
    confidence: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuoteAvgAggregateInputType = {
    totalAmount?: true
    deliveryDays?: true
    confidence?: true
  }

  export type QuoteSumAggregateInputType = {
    totalAmount?: true
    deliveryDays?: true
    confidence?: true
  }

  export type QuoteMinAggregateInputType = {
    id?: true
    orgId?: true
    requestId?: true
    vendorId?: true
    totalAmount?: true
    currency?: true
    deliveryDays?: true
    validUntil?: true
    source?: true
    confidence?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuoteMaxAggregateInputType = {
    id?: true
    orgId?: true
    requestId?: true
    vendorId?: true
    totalAmount?: true
    currency?: true
    deliveryDays?: true
    validUntil?: true
    source?: true
    confidence?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuoteCountAggregateInputType = {
    id?: true
    orgId?: true
    requestId?: true
    vendorId?: true
    items?: true
    totalAmount?: true
    currency?: true
    deliveryDays?: true
    validUntil?: true
    terms?: true
    source?: true
    rawData?: true
    confidence?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quote to aggregate.
     */
    where?: QuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotes to fetch.
     */
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quotes
    **/
    _count?: true | QuoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuoteMaxAggregateInputType
  }

  export type GetQuoteAggregateType<T extends QuoteAggregateArgs> = {
        [P in keyof T & keyof AggregateQuote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuote[P]>
      : GetScalarType<T[P], AggregateQuote[P]>
  }




  export type QuoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuoteWhereInput
    orderBy?: QuoteOrderByWithAggregationInput | QuoteOrderByWithAggregationInput[]
    by: QuoteScalarFieldEnum[] | QuoteScalarFieldEnum
    having?: QuoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuoteCountAggregateInputType | true
    _avg?: QuoteAvgAggregateInputType
    _sum?: QuoteSumAggregateInputType
    _min?: QuoteMinAggregateInputType
    _max?: QuoteMaxAggregateInputType
  }

  export type QuoteGroupByOutputType = {
    id: string
    orgId: string
    requestId: string
    vendorId: string
    items: JsonValue
    totalAmount: Decimal
    currency: string
    deliveryDays: number | null
    validUntil: Date | null
    terms: JsonValue | null
    source: $Enums.QuoteSource
    rawData: JsonValue | null
    confidence: number | null
    status: $Enums.QuoteStatus
    createdAt: Date
    updatedAt: Date
    _count: QuoteCountAggregateOutputType | null
    _avg: QuoteAvgAggregateOutputType | null
    _sum: QuoteSumAggregateOutputType | null
    _min: QuoteMinAggregateOutputType | null
    _max: QuoteMaxAggregateOutputType | null
  }

  type GetQuoteGroupByPayload<T extends QuoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuoteGroupByOutputType[P]>
            : GetScalarType<T[P], QuoteGroupByOutputType[P]>
        }
      >
    >


  export type QuoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    requestId?: boolean
    vendorId?: boolean
    items?: boolean
    totalAmount?: boolean
    currency?: boolean
    deliveryDays?: boolean
    validUntil?: boolean
    terms?: boolean
    source?: boolean
    rawData?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    payments?: boolean | Quote$paymentsArgs<ExtArgs>
    _count?: boolean | QuoteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quote"]>

  export type QuoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    requestId?: boolean
    vendorId?: boolean
    items?: boolean
    totalAmount?: boolean
    currency?: boolean
    deliveryDays?: boolean
    validUntil?: boolean
    terms?: boolean
    source?: boolean
    rawData?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quote"]>

  export type QuoteSelectScalar = {
    id?: boolean
    orgId?: boolean
    requestId?: boolean
    vendorId?: boolean
    items?: boolean
    totalAmount?: boolean
    currency?: boolean
    deliveryDays?: boolean
    validUntil?: boolean
    terms?: boolean
    source?: boolean
    rawData?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    payments?: boolean | Quote$paymentsArgs<ExtArgs>
    _count?: boolean | QuoteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }

  export type $QuotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quote"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      request: Prisma.$ProcurementRequestPayload<ExtArgs>
      vendor: Prisma.$VendorPayload<ExtArgs>
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgId: string
      requestId: string
      vendorId: string
      items: Prisma.JsonValue
      totalAmount: Prisma.Decimal
      currency: string
      deliveryDays: number | null
      validUntil: Date | null
      terms: Prisma.JsonValue | null
      source: $Enums.QuoteSource
      rawData: Prisma.JsonValue | null
      confidence: number | null
      status: $Enums.QuoteStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["quote"]>
    composites: {}
  }

  type QuoteGetPayload<S extends boolean | null | undefined | QuoteDefaultArgs> = $Result.GetResult<Prisma.$QuotePayload, S>

  type QuoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuoteCountAggregateInputType | true
    }

  export interface QuoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quote'], meta: { name: 'Quote' } }
    /**
     * Find zero or one Quote that matches the filter.
     * @param {QuoteFindUniqueArgs} args - Arguments to find a Quote
     * @example
     * // Get one Quote
     * const quote = await prisma.quote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuoteFindUniqueArgs>(args: SelectSubset<T, QuoteFindUniqueArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Quote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuoteFindUniqueOrThrowArgs} args - Arguments to find a Quote
     * @example
     * // Get one Quote
     * const quote = await prisma.quote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuoteFindUniqueOrThrowArgs>(args: SelectSubset<T, QuoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Quote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteFindFirstArgs} args - Arguments to find a Quote
     * @example
     * // Get one Quote
     * const quote = await prisma.quote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuoteFindFirstArgs>(args?: SelectSubset<T, QuoteFindFirstArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Quote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteFindFirstOrThrowArgs} args - Arguments to find a Quote
     * @example
     * // Get one Quote
     * const quote = await prisma.quote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuoteFindFirstOrThrowArgs>(args?: SelectSubset<T, QuoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Quotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quotes
     * const quotes = await prisma.quote.findMany()
     * 
     * // Get first 10 Quotes
     * const quotes = await prisma.quote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quoteWithIdOnly = await prisma.quote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuoteFindManyArgs>(args?: SelectSubset<T, QuoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Quote.
     * @param {QuoteCreateArgs} args - Arguments to create a Quote.
     * @example
     * // Create one Quote
     * const Quote = await prisma.quote.create({
     *   data: {
     *     // ... data to create a Quote
     *   }
     * })
     * 
     */
    create<T extends QuoteCreateArgs>(args: SelectSubset<T, QuoteCreateArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Quotes.
     * @param {QuoteCreateManyArgs} args - Arguments to create many Quotes.
     * @example
     * // Create many Quotes
     * const quote = await prisma.quote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuoteCreateManyArgs>(args?: SelectSubset<T, QuoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quotes and returns the data saved in the database.
     * @param {QuoteCreateManyAndReturnArgs} args - Arguments to create many Quotes.
     * @example
     * // Create many Quotes
     * const quote = await prisma.quote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quotes and only return the `id`
     * const quoteWithIdOnly = await prisma.quote.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuoteCreateManyAndReturnArgs>(args?: SelectSubset<T, QuoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Quote.
     * @param {QuoteDeleteArgs} args - Arguments to delete one Quote.
     * @example
     * // Delete one Quote
     * const Quote = await prisma.quote.delete({
     *   where: {
     *     // ... filter to delete one Quote
     *   }
     * })
     * 
     */
    delete<T extends QuoteDeleteArgs>(args: SelectSubset<T, QuoteDeleteArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Quote.
     * @param {QuoteUpdateArgs} args - Arguments to update one Quote.
     * @example
     * // Update one Quote
     * const quote = await prisma.quote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuoteUpdateArgs>(args: SelectSubset<T, QuoteUpdateArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Quotes.
     * @param {QuoteDeleteManyArgs} args - Arguments to filter Quotes to delete.
     * @example
     * // Delete a few Quotes
     * const { count } = await prisma.quote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuoteDeleteManyArgs>(args?: SelectSubset<T, QuoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quotes
     * const quote = await prisma.quote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuoteUpdateManyArgs>(args: SelectSubset<T, QuoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Quote.
     * @param {QuoteUpsertArgs} args - Arguments to update or create a Quote.
     * @example
     * // Update or create a Quote
     * const quote = await prisma.quote.upsert({
     *   create: {
     *     // ... data to create a Quote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quote we want to update
     *   }
     * })
     */
    upsert<T extends QuoteUpsertArgs>(args: SelectSubset<T, QuoteUpsertArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Quotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteCountArgs} args - Arguments to filter Quotes to count.
     * @example
     * // Count the number of Quotes
     * const count = await prisma.quote.count({
     *   where: {
     *     // ... the filter for the Quotes we want to count
     *   }
     * })
    **/
    count<T extends QuoteCountArgs>(
      args?: Subset<T, QuoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuoteAggregateArgs>(args: Subset<T, QuoteAggregateArgs>): Prisma.PrismaPromise<GetQuoteAggregateType<T>>

    /**
     * Group by Quote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuoteGroupByArgs['orderBy'] }
        : { orderBy?: QuoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quote model
   */
  readonly fields: QuoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    request<T extends ProcurementRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProcurementRequestDefaultArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    payments<T extends Quote$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Quote$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quote model
   */ 
  interface QuoteFieldRefs {
    readonly id: FieldRef<"Quote", 'String'>
    readonly orgId: FieldRef<"Quote", 'String'>
    readonly requestId: FieldRef<"Quote", 'String'>
    readonly vendorId: FieldRef<"Quote", 'String'>
    readonly items: FieldRef<"Quote", 'Json'>
    readonly totalAmount: FieldRef<"Quote", 'Decimal'>
    readonly currency: FieldRef<"Quote", 'String'>
    readonly deliveryDays: FieldRef<"Quote", 'Int'>
    readonly validUntil: FieldRef<"Quote", 'DateTime'>
    readonly terms: FieldRef<"Quote", 'Json'>
    readonly source: FieldRef<"Quote", 'QuoteSource'>
    readonly rawData: FieldRef<"Quote", 'Json'>
    readonly confidence: FieldRef<"Quote", 'Float'>
    readonly status: FieldRef<"Quote", 'QuoteStatus'>
    readonly createdAt: FieldRef<"Quote", 'DateTime'>
    readonly updatedAt: FieldRef<"Quote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Quote findUnique
   */
  export type QuoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * Filter, which Quote to fetch.
     */
    where: QuoteWhereUniqueInput
  }

  /**
   * Quote findUniqueOrThrow
   */
  export type QuoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * Filter, which Quote to fetch.
     */
    where: QuoteWhereUniqueInput
  }

  /**
   * Quote findFirst
   */
  export type QuoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * Filter, which Quote to fetch.
     */
    where?: QuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotes to fetch.
     */
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotes.
     */
    cursor?: QuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotes.
     */
    distinct?: QuoteScalarFieldEnum | QuoteScalarFieldEnum[]
  }

  /**
   * Quote findFirstOrThrow
   */
  export type QuoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * Filter, which Quote to fetch.
     */
    where?: QuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotes to fetch.
     */
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotes.
     */
    cursor?: QuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotes.
     */
    distinct?: QuoteScalarFieldEnum | QuoteScalarFieldEnum[]
  }

  /**
   * Quote findMany
   */
  export type QuoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * Filter, which Quotes to fetch.
     */
    where?: QuoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotes to fetch.
     */
    orderBy?: QuoteOrderByWithRelationInput | QuoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quotes.
     */
    cursor?: QuoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotes.
     */
    skip?: number
    distinct?: QuoteScalarFieldEnum | QuoteScalarFieldEnum[]
  }

  /**
   * Quote create
   */
  export type QuoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Quote.
     */
    data: XOR<QuoteCreateInput, QuoteUncheckedCreateInput>
  }

  /**
   * Quote createMany
   */
  export type QuoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quotes.
     */
    data: QuoteCreateManyInput | QuoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Quote createManyAndReturn
   */
  export type QuoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Quotes.
     */
    data: QuoteCreateManyInput | QuoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quote update
   */
  export type QuoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Quote.
     */
    data: XOR<QuoteUpdateInput, QuoteUncheckedUpdateInput>
    /**
     * Choose, which Quote to update.
     */
    where: QuoteWhereUniqueInput
  }

  /**
   * Quote updateMany
   */
  export type QuoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quotes.
     */
    data: XOR<QuoteUpdateManyMutationInput, QuoteUncheckedUpdateManyInput>
    /**
     * Filter which Quotes to update
     */
    where?: QuoteWhereInput
  }

  /**
   * Quote upsert
   */
  export type QuoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Quote to update in case it exists.
     */
    where: QuoteWhereUniqueInput
    /**
     * In case the Quote found by the `where` argument doesn't exist, create a new Quote with this data.
     */
    create: XOR<QuoteCreateInput, QuoteUncheckedCreateInput>
    /**
     * In case the Quote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuoteUpdateInput, QuoteUncheckedUpdateInput>
  }

  /**
   * Quote delete
   */
  export type QuoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
    /**
     * Filter which Quote to delete.
     */
    where: QuoteWhereUniqueInput
  }

  /**
   * Quote deleteMany
   */
  export type QuoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotes to delete
     */
    where?: QuoteWhereInput
  }

  /**
   * Quote.payments
   */
  export type Quote$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Quote without action
   */
  export type QuoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quote
     */
    select?: QuoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuoteInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    orgId: string | null
    requestId: string | null
    quoteId: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.PaymentStatus | null
    stripePaymentIntentId: string | null
    stripeChargeId: string | null
    method: string | null
    createdAt: Date | null
    updatedAt: Date | null
    paidAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    orgId: string | null
    requestId: string | null
    quoteId: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.PaymentStatus | null
    stripePaymentIntentId: string | null
    stripeChargeId: string | null
    method: string | null
    createdAt: Date | null
    updatedAt: Date | null
    paidAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    orgId: number
    requestId: number
    quoteId: number
    amount: number
    currency: number
    status: number
    stripePaymentIntentId: number
    stripeChargeId: number
    method: number
    metadata: number
    createdAt: number
    updatedAt: number
    paidAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    orgId?: true
    requestId?: true
    quoteId?: true
    amount?: true
    currency?: true
    status?: true
    stripePaymentIntentId?: true
    stripeChargeId?: true
    method?: true
    createdAt?: true
    updatedAt?: true
    paidAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    orgId?: true
    requestId?: true
    quoteId?: true
    amount?: true
    currency?: true
    status?: true
    stripePaymentIntentId?: true
    stripeChargeId?: true
    method?: true
    createdAt?: true
    updatedAt?: true
    paidAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    orgId?: true
    requestId?: true
    quoteId?: true
    amount?: true
    currency?: true
    status?: true
    stripePaymentIntentId?: true
    stripeChargeId?: true
    method?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    paidAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    orgId: string
    requestId: string
    quoteId: string
    amount: Decimal
    currency: string
    status: $Enums.PaymentStatus
    stripePaymentIntentId: string | null
    stripeChargeId: string | null
    method: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    paidAt: Date | null
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    requestId?: boolean
    quoteId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    stripePaymentIntentId?: boolean
    stripeChargeId?: boolean
    method?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paidAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    quote?: boolean | QuoteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    requestId?: boolean
    quoteId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    stripePaymentIntentId?: boolean
    stripeChargeId?: boolean
    method?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paidAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    quote?: boolean | QuoteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    orgId?: boolean
    requestId?: boolean
    quoteId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    stripePaymentIntentId?: boolean
    stripeChargeId?: boolean
    method?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paidAt?: boolean
  }

  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    quote?: boolean | QuoteDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    request?: boolean | ProcurementRequestDefaultArgs<ExtArgs>
    quote?: boolean | QuoteDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      request: Prisma.$ProcurementRequestPayload<ExtArgs>
      quote: Prisma.$QuotePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgId: string
      requestId: string
      quoteId: string
      amount: Prisma.Decimal
      currency: string
      status: $Enums.PaymentStatus
      stripePaymentIntentId: string | null
      stripeChargeId: string | null
      method: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      paidAt: Date | null
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    request<T extends ProcurementRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProcurementRequestDefaultArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    quote<T extends QuoteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuoteDefaultArgs<ExtArgs>>): Prisma__QuoteClient<$Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */ 
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly orgId: FieldRef<"Payment", 'String'>
    readonly requestId: FieldRef<"Payment", 'String'>
    readonly quoteId: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly stripePaymentIntentId: FieldRef<"Payment", 'String'>
    readonly stripeChargeId: FieldRef<"Payment", 'String'>
    readonly method: FieldRef<"Payment", 'String'>
    readonly metadata: FieldRef<"Payment", 'Json'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
    readonly paidAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    orgId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    userId: string | null
    createdAt: Date | null
    requestId: string | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    orgId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    userId: string | null
    createdAt: Date | null
    requestId: string | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    orgId: number
    action: number
    entityType: number
    entityId: number
    userId: number
    oldValues: number
    newValues: number
    metadata: number
    createdAt: number
    requestId: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    orgId?: true
    action?: true
    entityType?: true
    entityId?: true
    userId?: true
    createdAt?: true
    requestId?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    orgId?: true
    action?: true
    entityType?: true
    entityId?: true
    userId?: true
    createdAt?: true
    requestId?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    orgId?: true
    action?: true
    entityType?: true
    entityId?: true
    userId?: true
    oldValues?: true
    newValues?: true
    metadata?: true
    createdAt?: true
    requestId?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    userId: string | null
    oldValues: JsonValue | null
    newValues: JsonValue | null
    metadata: JsonValue | null
    createdAt: Date
    requestId: string | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    oldValues?: boolean
    newValues?: boolean
    metadata?: boolean
    createdAt?: boolean
    requestId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
    request?: boolean | AuditLog$requestArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    oldValues?: boolean
    newValues?: boolean
    metadata?: boolean
    createdAt?: boolean
    requestId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
    request?: boolean | AuditLog$requestArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    orgId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    oldValues?: boolean
    newValues?: boolean
    metadata?: boolean
    createdAt?: boolean
    requestId?: boolean
  }

  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
    request?: boolean | AuditLog$requestArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
    request?: boolean | AuditLog$requestArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
      request: Prisma.$ProcurementRequestPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgId: string
      action: string
      entityType: string
      entityId: string
      userId: string | null
      oldValues: Prisma.JsonValue | null
      newValues: Prisma.JsonValue | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      requestId: string | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    request<T extends AuditLog$requestArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$requestArgs<ExtArgs>>): Prisma__ProcurementRequestClient<$Result.GetResult<Prisma.$ProcurementRequestPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */ 
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly orgId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly oldValues: FieldRef<"AuditLog", 'Json'>
    readonly newValues: FieldRef<"AuditLog", 'Json'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
    readonly requestId: FieldRef<"AuditLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog.request
   */
  export type AuditLog$requestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcurementRequest
     */
    select?: ProcurementRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcurementRequestInclude<ExtArgs> | null
    where?: ProcurementRequestWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model EmailThread
   */

  export type AggregateEmailThread = {
    _count: EmailThreadCountAggregateOutputType | null
    _avg: EmailThreadAvgAggregateOutputType | null
    _sum: EmailThreadSumAggregateOutputType | null
    _min: EmailThreadMinAggregateOutputType | null
    _max: EmailThreadMaxAggregateOutputType | null
  }

  export type EmailThreadAvgAggregateOutputType = {
    messageCount: number | null
  }

  export type EmailThreadSumAggregateOutputType = {
    messageCount: number | null
  }

  export type EmailThreadMinAggregateOutputType = {
    id: string | null
    orgId: string | null
    gmailThreadId: string | null
    subject: string | null
    requestId: string | null
    lastMessageAt: Date | null
    messageCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmailThreadMaxAggregateOutputType = {
    id: string | null
    orgId: string | null
    gmailThreadId: string | null
    subject: string | null
    requestId: string | null
    lastMessageAt: Date | null
    messageCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmailThreadCountAggregateOutputType = {
    id: number
    orgId: number
    gmailThreadId: number
    subject: number
    participants: number
    requestId: number
    lastMessageAt: number
    messageCount: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EmailThreadAvgAggregateInputType = {
    messageCount?: true
  }

  export type EmailThreadSumAggregateInputType = {
    messageCount?: true
  }

  export type EmailThreadMinAggregateInputType = {
    id?: true
    orgId?: true
    gmailThreadId?: true
    subject?: true
    requestId?: true
    lastMessageAt?: true
    messageCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmailThreadMaxAggregateInputType = {
    id?: true
    orgId?: true
    gmailThreadId?: true
    subject?: true
    requestId?: true
    lastMessageAt?: true
    messageCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmailThreadCountAggregateInputType = {
    id?: true
    orgId?: true
    gmailThreadId?: true
    subject?: true
    participants?: true
    requestId?: true
    lastMessageAt?: true
    messageCount?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EmailThreadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailThread to aggregate.
     */
    where?: EmailThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailThreads to fetch.
     */
    orderBy?: EmailThreadOrderByWithRelationInput | EmailThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailThreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailThreads
    **/
    _count?: true | EmailThreadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmailThreadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmailThreadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailThreadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailThreadMaxAggregateInputType
  }

  export type GetEmailThreadAggregateType<T extends EmailThreadAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailThread]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailThread[P]>
      : GetScalarType<T[P], AggregateEmailThread[P]>
  }




  export type EmailThreadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailThreadWhereInput
    orderBy?: EmailThreadOrderByWithAggregationInput | EmailThreadOrderByWithAggregationInput[]
    by: EmailThreadScalarFieldEnum[] | EmailThreadScalarFieldEnum
    having?: EmailThreadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailThreadCountAggregateInputType | true
    _avg?: EmailThreadAvgAggregateInputType
    _sum?: EmailThreadSumAggregateInputType
    _min?: EmailThreadMinAggregateInputType
    _max?: EmailThreadMaxAggregateInputType
  }

  export type EmailThreadGroupByOutputType = {
    id: string
    orgId: string
    gmailThreadId: string
    subject: string
    participants: JsonValue
    requestId: string | null
    lastMessageAt: Date
    messageCount: number
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: EmailThreadCountAggregateOutputType | null
    _avg: EmailThreadAvgAggregateOutputType | null
    _sum: EmailThreadSumAggregateOutputType | null
    _min: EmailThreadMinAggregateOutputType | null
    _max: EmailThreadMaxAggregateOutputType | null
  }

  type GetEmailThreadGroupByPayload<T extends EmailThreadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailThreadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailThreadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailThreadGroupByOutputType[P]>
            : GetScalarType<T[P], EmailThreadGroupByOutputType[P]>
        }
      >
    >


  export type EmailThreadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    gmailThreadId?: boolean
    subject?: boolean
    participants?: boolean
    requestId?: boolean
    lastMessageAt?: boolean
    messageCount?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | EmailThread$messagesArgs<ExtArgs>
    _count?: boolean | EmailThreadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailThread"]>

  export type EmailThreadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    gmailThreadId?: boolean
    subject?: boolean
    participants?: boolean
    requestId?: boolean
    lastMessageAt?: boolean
    messageCount?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["emailThread"]>

  export type EmailThreadSelectScalar = {
    id?: boolean
    orgId?: boolean
    gmailThreadId?: boolean
    subject?: boolean
    participants?: boolean
    requestId?: boolean
    lastMessageAt?: boolean
    messageCount?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EmailThreadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | EmailThread$messagesArgs<ExtArgs>
    _count?: boolean | EmailThreadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EmailThreadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EmailThreadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailThread"
    objects: {
      messages: Prisma.$EmailMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgId: string
      gmailThreadId: string
      subject: string
      participants: Prisma.JsonValue
      requestId: string | null
      lastMessageAt: Date
      messageCount: number
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["emailThread"]>
    composites: {}
  }

  type EmailThreadGetPayload<S extends boolean | null | undefined | EmailThreadDefaultArgs> = $Result.GetResult<Prisma.$EmailThreadPayload, S>

  type EmailThreadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmailThreadFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmailThreadCountAggregateInputType | true
    }

  export interface EmailThreadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailThread'], meta: { name: 'EmailThread' } }
    /**
     * Find zero or one EmailThread that matches the filter.
     * @param {EmailThreadFindUniqueArgs} args - Arguments to find a EmailThread
     * @example
     * // Get one EmailThread
     * const emailThread = await prisma.emailThread.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailThreadFindUniqueArgs>(args: SelectSubset<T, EmailThreadFindUniqueArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EmailThread that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmailThreadFindUniqueOrThrowArgs} args - Arguments to find a EmailThread
     * @example
     * // Get one EmailThread
     * const emailThread = await prisma.emailThread.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailThreadFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailThreadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EmailThread that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadFindFirstArgs} args - Arguments to find a EmailThread
     * @example
     * // Get one EmailThread
     * const emailThread = await prisma.emailThread.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailThreadFindFirstArgs>(args?: SelectSubset<T, EmailThreadFindFirstArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EmailThread that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadFindFirstOrThrowArgs} args - Arguments to find a EmailThread
     * @example
     * // Get one EmailThread
     * const emailThread = await prisma.emailThread.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailThreadFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailThreadFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EmailThreads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailThreads
     * const emailThreads = await prisma.emailThread.findMany()
     * 
     * // Get first 10 EmailThreads
     * const emailThreads = await prisma.emailThread.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailThreadWithIdOnly = await prisma.emailThread.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailThreadFindManyArgs>(args?: SelectSubset<T, EmailThreadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EmailThread.
     * @param {EmailThreadCreateArgs} args - Arguments to create a EmailThread.
     * @example
     * // Create one EmailThread
     * const EmailThread = await prisma.emailThread.create({
     *   data: {
     *     // ... data to create a EmailThread
     *   }
     * })
     * 
     */
    create<T extends EmailThreadCreateArgs>(args: SelectSubset<T, EmailThreadCreateArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EmailThreads.
     * @param {EmailThreadCreateManyArgs} args - Arguments to create many EmailThreads.
     * @example
     * // Create many EmailThreads
     * const emailThread = await prisma.emailThread.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailThreadCreateManyArgs>(args?: SelectSubset<T, EmailThreadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailThreads and returns the data saved in the database.
     * @param {EmailThreadCreateManyAndReturnArgs} args - Arguments to create many EmailThreads.
     * @example
     * // Create many EmailThreads
     * const emailThread = await prisma.emailThread.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailThreads and only return the `id`
     * const emailThreadWithIdOnly = await prisma.emailThread.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailThreadCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailThreadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EmailThread.
     * @param {EmailThreadDeleteArgs} args - Arguments to delete one EmailThread.
     * @example
     * // Delete one EmailThread
     * const EmailThread = await prisma.emailThread.delete({
     *   where: {
     *     // ... filter to delete one EmailThread
     *   }
     * })
     * 
     */
    delete<T extends EmailThreadDeleteArgs>(args: SelectSubset<T, EmailThreadDeleteArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EmailThread.
     * @param {EmailThreadUpdateArgs} args - Arguments to update one EmailThread.
     * @example
     * // Update one EmailThread
     * const emailThread = await prisma.emailThread.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailThreadUpdateArgs>(args: SelectSubset<T, EmailThreadUpdateArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EmailThreads.
     * @param {EmailThreadDeleteManyArgs} args - Arguments to filter EmailThreads to delete.
     * @example
     * // Delete a few EmailThreads
     * const { count } = await prisma.emailThread.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailThreadDeleteManyArgs>(args?: SelectSubset<T, EmailThreadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailThreads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailThreads
     * const emailThread = await prisma.emailThread.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailThreadUpdateManyArgs>(args: SelectSubset<T, EmailThreadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmailThread.
     * @param {EmailThreadUpsertArgs} args - Arguments to update or create a EmailThread.
     * @example
     * // Update or create a EmailThread
     * const emailThread = await prisma.emailThread.upsert({
     *   create: {
     *     // ... data to create a EmailThread
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailThread we want to update
     *   }
     * })
     */
    upsert<T extends EmailThreadUpsertArgs>(args: SelectSubset<T, EmailThreadUpsertArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EmailThreads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadCountArgs} args - Arguments to filter EmailThreads to count.
     * @example
     * // Count the number of EmailThreads
     * const count = await prisma.emailThread.count({
     *   where: {
     *     // ... the filter for the EmailThreads we want to count
     *   }
     * })
    **/
    count<T extends EmailThreadCountArgs>(
      args?: Subset<T, EmailThreadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailThreadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailThread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailThreadAggregateArgs>(args: Subset<T, EmailThreadAggregateArgs>): Prisma.PrismaPromise<GetEmailThreadAggregateType<T>>

    /**
     * Group by EmailThread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailThreadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailThreadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailThreadGroupByArgs['orderBy'] }
        : { orderBy?: EmailThreadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailThreadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailThreadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailThread model
   */
  readonly fields: EmailThreadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailThread.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailThreadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends EmailThread$messagesArgs<ExtArgs> = {}>(args?: Subset<T, EmailThread$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailThread model
   */ 
  interface EmailThreadFieldRefs {
    readonly id: FieldRef<"EmailThread", 'String'>
    readonly orgId: FieldRef<"EmailThread", 'String'>
    readonly gmailThreadId: FieldRef<"EmailThread", 'String'>
    readonly subject: FieldRef<"EmailThread", 'String'>
    readonly participants: FieldRef<"EmailThread", 'Json'>
    readonly requestId: FieldRef<"EmailThread", 'String'>
    readonly lastMessageAt: FieldRef<"EmailThread", 'DateTime'>
    readonly messageCount: FieldRef<"EmailThread", 'Int'>
    readonly metadata: FieldRef<"EmailThread", 'Json'>
    readonly createdAt: FieldRef<"EmailThread", 'DateTime'>
    readonly updatedAt: FieldRef<"EmailThread", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailThread findUnique
   */
  export type EmailThreadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * Filter, which EmailThread to fetch.
     */
    where: EmailThreadWhereUniqueInput
  }

  /**
   * EmailThread findUniqueOrThrow
   */
  export type EmailThreadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * Filter, which EmailThread to fetch.
     */
    where: EmailThreadWhereUniqueInput
  }

  /**
   * EmailThread findFirst
   */
  export type EmailThreadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * Filter, which EmailThread to fetch.
     */
    where?: EmailThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailThreads to fetch.
     */
    orderBy?: EmailThreadOrderByWithRelationInput | EmailThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailThreads.
     */
    cursor?: EmailThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailThreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailThreads.
     */
    distinct?: EmailThreadScalarFieldEnum | EmailThreadScalarFieldEnum[]
  }

  /**
   * EmailThread findFirstOrThrow
   */
  export type EmailThreadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * Filter, which EmailThread to fetch.
     */
    where?: EmailThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailThreads to fetch.
     */
    orderBy?: EmailThreadOrderByWithRelationInput | EmailThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailThreads.
     */
    cursor?: EmailThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailThreads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailThreads.
     */
    distinct?: EmailThreadScalarFieldEnum | EmailThreadScalarFieldEnum[]
  }

  /**
   * EmailThread findMany
   */
  export type EmailThreadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * Filter, which EmailThreads to fetch.
     */
    where?: EmailThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailThreads to fetch.
     */
    orderBy?: EmailThreadOrderByWithRelationInput | EmailThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailThreads.
     */
    cursor?: EmailThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailThreads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailThreads.
     */
    skip?: number
    distinct?: EmailThreadScalarFieldEnum | EmailThreadScalarFieldEnum[]
  }

  /**
   * EmailThread create
   */
  export type EmailThreadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * The data needed to create a EmailThread.
     */
    data: XOR<EmailThreadCreateInput, EmailThreadUncheckedCreateInput>
  }

  /**
   * EmailThread createMany
   */
  export type EmailThreadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailThreads.
     */
    data: EmailThreadCreateManyInput | EmailThreadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailThread createManyAndReturn
   */
  export type EmailThreadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EmailThreads.
     */
    data: EmailThreadCreateManyInput | EmailThreadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailThread update
   */
  export type EmailThreadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * The data needed to update a EmailThread.
     */
    data: XOR<EmailThreadUpdateInput, EmailThreadUncheckedUpdateInput>
    /**
     * Choose, which EmailThread to update.
     */
    where: EmailThreadWhereUniqueInput
  }

  /**
   * EmailThread updateMany
   */
  export type EmailThreadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailThreads.
     */
    data: XOR<EmailThreadUpdateManyMutationInput, EmailThreadUncheckedUpdateManyInput>
    /**
     * Filter which EmailThreads to update
     */
    where?: EmailThreadWhereInput
  }

  /**
   * EmailThread upsert
   */
  export type EmailThreadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * The filter to search for the EmailThread to update in case it exists.
     */
    where: EmailThreadWhereUniqueInput
    /**
     * In case the EmailThread found by the `where` argument doesn't exist, create a new EmailThread with this data.
     */
    create: XOR<EmailThreadCreateInput, EmailThreadUncheckedCreateInput>
    /**
     * In case the EmailThread was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailThreadUpdateInput, EmailThreadUncheckedUpdateInput>
  }

  /**
   * EmailThread delete
   */
  export type EmailThreadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
    /**
     * Filter which EmailThread to delete.
     */
    where: EmailThreadWhereUniqueInput
  }

  /**
   * EmailThread deleteMany
   */
  export type EmailThreadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailThreads to delete
     */
    where?: EmailThreadWhereInput
  }

  /**
   * EmailThread.messages
   */
  export type EmailThread$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    where?: EmailMessageWhereInput
    orderBy?: EmailMessageOrderByWithRelationInput | EmailMessageOrderByWithRelationInput[]
    cursor?: EmailMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmailMessageScalarFieldEnum | EmailMessageScalarFieldEnum[]
  }

  /**
   * EmailThread without action
   */
  export type EmailThreadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailThread
     */
    select?: EmailThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailThreadInclude<ExtArgs> | null
  }


  /**
   * Model EmailMessage
   */

  export type AggregateEmailMessage = {
    _count: EmailMessageCountAggregateOutputType | null
    _min: EmailMessageMinAggregateOutputType | null
    _max: EmailMessageMaxAggregateOutputType | null
  }

  export type EmailMessageMinAggregateOutputType = {
    id: string | null
    threadId: string | null
    gmailMessageId: string | null
    sender: string | null
    subject: string | null
    body: string | null
    isProcessed: boolean | null
    createdAt: Date | null
    receivedAt: Date | null
  }

  export type EmailMessageMaxAggregateOutputType = {
    id: string | null
    threadId: string | null
    gmailMessageId: string | null
    sender: string | null
    subject: string | null
    body: string | null
    isProcessed: boolean | null
    createdAt: Date | null
    receivedAt: Date | null
  }

  export type EmailMessageCountAggregateOutputType = {
    id: number
    threadId: number
    gmailMessageId: number
    sender: number
    to: number
    subject: number
    body: number
    isProcessed: number
    extractedData: number
    attachments: number
    createdAt: number
    receivedAt: number
    _all: number
  }


  export type EmailMessageMinAggregateInputType = {
    id?: true
    threadId?: true
    gmailMessageId?: true
    sender?: true
    subject?: true
    body?: true
    isProcessed?: true
    createdAt?: true
    receivedAt?: true
  }

  export type EmailMessageMaxAggregateInputType = {
    id?: true
    threadId?: true
    gmailMessageId?: true
    sender?: true
    subject?: true
    body?: true
    isProcessed?: true
    createdAt?: true
    receivedAt?: true
  }

  export type EmailMessageCountAggregateInputType = {
    id?: true
    threadId?: true
    gmailMessageId?: true
    sender?: true
    to?: true
    subject?: true
    body?: true
    isProcessed?: true
    extractedData?: true
    attachments?: true
    createdAt?: true
    receivedAt?: true
    _all?: true
  }

  export type EmailMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailMessage to aggregate.
     */
    where?: EmailMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailMessages to fetch.
     */
    orderBy?: EmailMessageOrderByWithRelationInput | EmailMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailMessages
    **/
    _count?: true | EmailMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailMessageMaxAggregateInputType
  }

  export type GetEmailMessageAggregateType<T extends EmailMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailMessage[P]>
      : GetScalarType<T[P], AggregateEmailMessage[P]>
  }




  export type EmailMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailMessageWhereInput
    orderBy?: EmailMessageOrderByWithAggregationInput | EmailMessageOrderByWithAggregationInput[]
    by: EmailMessageScalarFieldEnum[] | EmailMessageScalarFieldEnum
    having?: EmailMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailMessageCountAggregateInputType | true
    _min?: EmailMessageMinAggregateInputType
    _max?: EmailMessageMaxAggregateInputType
  }

  export type EmailMessageGroupByOutputType = {
    id: string
    threadId: string
    gmailMessageId: string
    sender: string
    to: JsonValue
    subject: string
    body: string
    isProcessed: boolean
    extractedData: JsonValue | null
    attachments: JsonValue | null
    createdAt: Date
    receivedAt: Date
    _count: EmailMessageCountAggregateOutputType | null
    _min: EmailMessageMinAggregateOutputType | null
    _max: EmailMessageMaxAggregateOutputType | null
  }

  type GetEmailMessageGroupByPayload<T extends EmailMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailMessageGroupByOutputType[P]>
            : GetScalarType<T[P], EmailMessageGroupByOutputType[P]>
        }
      >
    >


  export type EmailMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    threadId?: boolean
    gmailMessageId?: boolean
    sender?: boolean
    to?: boolean
    subject?: boolean
    body?: boolean
    isProcessed?: boolean
    extractedData?: boolean
    attachments?: boolean
    createdAt?: boolean
    receivedAt?: boolean
    thread?: boolean | EmailThreadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailMessage"]>

  export type EmailMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    threadId?: boolean
    gmailMessageId?: boolean
    sender?: boolean
    to?: boolean
    subject?: boolean
    body?: boolean
    isProcessed?: boolean
    extractedData?: boolean
    attachments?: boolean
    createdAt?: boolean
    receivedAt?: boolean
    thread?: boolean | EmailThreadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailMessage"]>

  export type EmailMessageSelectScalar = {
    id?: boolean
    threadId?: boolean
    gmailMessageId?: boolean
    sender?: boolean
    to?: boolean
    subject?: boolean
    body?: boolean
    isProcessed?: boolean
    extractedData?: boolean
    attachments?: boolean
    createdAt?: boolean
    receivedAt?: boolean
  }

  export type EmailMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | EmailThreadDefaultArgs<ExtArgs>
  }
  export type EmailMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    thread?: boolean | EmailThreadDefaultArgs<ExtArgs>
  }

  export type $EmailMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailMessage"
    objects: {
      thread: Prisma.$EmailThreadPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      threadId: string
      gmailMessageId: string
      sender: string
      to: Prisma.JsonValue
      subject: string
      body: string
      isProcessed: boolean
      extractedData: Prisma.JsonValue | null
      attachments: Prisma.JsonValue | null
      createdAt: Date
      receivedAt: Date
    }, ExtArgs["result"]["emailMessage"]>
    composites: {}
  }

  type EmailMessageGetPayload<S extends boolean | null | undefined | EmailMessageDefaultArgs> = $Result.GetResult<Prisma.$EmailMessagePayload, S>

  type EmailMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmailMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmailMessageCountAggregateInputType | true
    }

  export interface EmailMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailMessage'], meta: { name: 'EmailMessage' } }
    /**
     * Find zero or one EmailMessage that matches the filter.
     * @param {EmailMessageFindUniqueArgs} args - Arguments to find a EmailMessage
     * @example
     * // Get one EmailMessage
     * const emailMessage = await prisma.emailMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailMessageFindUniqueArgs>(args: SelectSubset<T, EmailMessageFindUniqueArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EmailMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmailMessageFindUniqueOrThrowArgs} args - Arguments to find a EmailMessage
     * @example
     * // Get one EmailMessage
     * const emailMessage = await prisma.emailMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EmailMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageFindFirstArgs} args - Arguments to find a EmailMessage
     * @example
     * // Get one EmailMessage
     * const emailMessage = await prisma.emailMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailMessageFindFirstArgs>(args?: SelectSubset<T, EmailMessageFindFirstArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EmailMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageFindFirstOrThrowArgs} args - Arguments to find a EmailMessage
     * @example
     * // Get one EmailMessage
     * const emailMessage = await prisma.emailMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EmailMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailMessages
     * const emailMessages = await prisma.emailMessage.findMany()
     * 
     * // Get first 10 EmailMessages
     * const emailMessages = await prisma.emailMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailMessageWithIdOnly = await prisma.emailMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailMessageFindManyArgs>(args?: SelectSubset<T, EmailMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EmailMessage.
     * @param {EmailMessageCreateArgs} args - Arguments to create a EmailMessage.
     * @example
     * // Create one EmailMessage
     * const EmailMessage = await prisma.emailMessage.create({
     *   data: {
     *     // ... data to create a EmailMessage
     *   }
     * })
     * 
     */
    create<T extends EmailMessageCreateArgs>(args: SelectSubset<T, EmailMessageCreateArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EmailMessages.
     * @param {EmailMessageCreateManyArgs} args - Arguments to create many EmailMessages.
     * @example
     * // Create many EmailMessages
     * const emailMessage = await prisma.emailMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailMessageCreateManyArgs>(args?: SelectSubset<T, EmailMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailMessages and returns the data saved in the database.
     * @param {EmailMessageCreateManyAndReturnArgs} args - Arguments to create many EmailMessages.
     * @example
     * // Create many EmailMessages
     * const emailMessage = await prisma.emailMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailMessages and only return the `id`
     * const emailMessageWithIdOnly = await prisma.emailMessage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EmailMessage.
     * @param {EmailMessageDeleteArgs} args - Arguments to delete one EmailMessage.
     * @example
     * // Delete one EmailMessage
     * const EmailMessage = await prisma.emailMessage.delete({
     *   where: {
     *     // ... filter to delete one EmailMessage
     *   }
     * })
     * 
     */
    delete<T extends EmailMessageDeleteArgs>(args: SelectSubset<T, EmailMessageDeleteArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EmailMessage.
     * @param {EmailMessageUpdateArgs} args - Arguments to update one EmailMessage.
     * @example
     * // Update one EmailMessage
     * const emailMessage = await prisma.emailMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailMessageUpdateArgs>(args: SelectSubset<T, EmailMessageUpdateArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EmailMessages.
     * @param {EmailMessageDeleteManyArgs} args - Arguments to filter EmailMessages to delete.
     * @example
     * // Delete a few EmailMessages
     * const { count } = await prisma.emailMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailMessageDeleteManyArgs>(args?: SelectSubset<T, EmailMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailMessages
     * const emailMessage = await prisma.emailMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailMessageUpdateManyArgs>(args: SelectSubset<T, EmailMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmailMessage.
     * @param {EmailMessageUpsertArgs} args - Arguments to update or create a EmailMessage.
     * @example
     * // Update or create a EmailMessage
     * const emailMessage = await prisma.emailMessage.upsert({
     *   create: {
     *     // ... data to create a EmailMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailMessage we want to update
     *   }
     * })
     */
    upsert<T extends EmailMessageUpsertArgs>(args: SelectSubset<T, EmailMessageUpsertArgs<ExtArgs>>): Prisma__EmailMessageClient<$Result.GetResult<Prisma.$EmailMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EmailMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageCountArgs} args - Arguments to filter EmailMessages to count.
     * @example
     * // Count the number of EmailMessages
     * const count = await prisma.emailMessage.count({
     *   where: {
     *     // ... the filter for the EmailMessages we want to count
     *   }
     * })
    **/
    count<T extends EmailMessageCountArgs>(
      args?: Subset<T, EmailMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailMessageAggregateArgs>(args: Subset<T, EmailMessageAggregateArgs>): Prisma.PrismaPromise<GetEmailMessageAggregateType<T>>

    /**
     * Group by EmailMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailMessageGroupByArgs['orderBy'] }
        : { orderBy?: EmailMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailMessage model
   */
  readonly fields: EmailMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    thread<T extends EmailThreadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmailThreadDefaultArgs<ExtArgs>>): Prisma__EmailThreadClient<$Result.GetResult<Prisma.$EmailThreadPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailMessage model
   */ 
  interface EmailMessageFieldRefs {
    readonly id: FieldRef<"EmailMessage", 'String'>
    readonly threadId: FieldRef<"EmailMessage", 'String'>
    readonly gmailMessageId: FieldRef<"EmailMessage", 'String'>
    readonly sender: FieldRef<"EmailMessage", 'String'>
    readonly to: FieldRef<"EmailMessage", 'Json'>
    readonly subject: FieldRef<"EmailMessage", 'String'>
    readonly body: FieldRef<"EmailMessage", 'String'>
    readonly isProcessed: FieldRef<"EmailMessage", 'Boolean'>
    readonly extractedData: FieldRef<"EmailMessage", 'Json'>
    readonly attachments: FieldRef<"EmailMessage", 'Json'>
    readonly createdAt: FieldRef<"EmailMessage", 'DateTime'>
    readonly receivedAt: FieldRef<"EmailMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailMessage findUnique
   */
  export type EmailMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * Filter, which EmailMessage to fetch.
     */
    where: EmailMessageWhereUniqueInput
  }

  /**
   * EmailMessage findUniqueOrThrow
   */
  export type EmailMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * Filter, which EmailMessage to fetch.
     */
    where: EmailMessageWhereUniqueInput
  }

  /**
   * EmailMessage findFirst
   */
  export type EmailMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * Filter, which EmailMessage to fetch.
     */
    where?: EmailMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailMessages to fetch.
     */
    orderBy?: EmailMessageOrderByWithRelationInput | EmailMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailMessages.
     */
    cursor?: EmailMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailMessages.
     */
    distinct?: EmailMessageScalarFieldEnum | EmailMessageScalarFieldEnum[]
  }

  /**
   * EmailMessage findFirstOrThrow
   */
  export type EmailMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * Filter, which EmailMessage to fetch.
     */
    where?: EmailMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailMessages to fetch.
     */
    orderBy?: EmailMessageOrderByWithRelationInput | EmailMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailMessages.
     */
    cursor?: EmailMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailMessages.
     */
    distinct?: EmailMessageScalarFieldEnum | EmailMessageScalarFieldEnum[]
  }

  /**
   * EmailMessage findMany
   */
  export type EmailMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * Filter, which EmailMessages to fetch.
     */
    where?: EmailMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailMessages to fetch.
     */
    orderBy?: EmailMessageOrderByWithRelationInput | EmailMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailMessages.
     */
    cursor?: EmailMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailMessages.
     */
    skip?: number
    distinct?: EmailMessageScalarFieldEnum | EmailMessageScalarFieldEnum[]
  }

  /**
   * EmailMessage create
   */
  export type EmailMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a EmailMessage.
     */
    data: XOR<EmailMessageCreateInput, EmailMessageUncheckedCreateInput>
  }

  /**
   * EmailMessage createMany
   */
  export type EmailMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailMessages.
     */
    data: EmailMessageCreateManyInput | EmailMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailMessage createManyAndReturn
   */
  export type EmailMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EmailMessages.
     */
    data: EmailMessageCreateManyInput | EmailMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmailMessage update
   */
  export type EmailMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a EmailMessage.
     */
    data: XOR<EmailMessageUpdateInput, EmailMessageUncheckedUpdateInput>
    /**
     * Choose, which EmailMessage to update.
     */
    where: EmailMessageWhereUniqueInput
  }

  /**
   * EmailMessage updateMany
   */
  export type EmailMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailMessages.
     */
    data: XOR<EmailMessageUpdateManyMutationInput, EmailMessageUncheckedUpdateManyInput>
    /**
     * Filter which EmailMessages to update
     */
    where?: EmailMessageWhereInput
  }

  /**
   * EmailMessage upsert
   */
  export type EmailMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the EmailMessage to update in case it exists.
     */
    where: EmailMessageWhereUniqueInput
    /**
     * In case the EmailMessage found by the `where` argument doesn't exist, create a new EmailMessage with this data.
     */
    create: XOR<EmailMessageCreateInput, EmailMessageUncheckedCreateInput>
    /**
     * In case the EmailMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailMessageUpdateInput, EmailMessageUncheckedUpdateInput>
  }

  /**
   * EmailMessage delete
   */
  export type EmailMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
    /**
     * Filter which EmailMessage to delete.
     */
    where: EmailMessageWhereUniqueInput
  }

  /**
   * EmailMessage deleteMany
   */
  export type EmailMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailMessages to delete
     */
    where?: EmailMessageWhereInput
  }

  /**
   * EmailMessage without action
   */
  export type EmailMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailMessage
     */
    select?: EmailMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailMessageInclude<ExtArgs> | null
  }


  /**
   * Model WorkflowExecution
   */

  export type AggregateWorkflowExecution = {
    _count: WorkflowExecutionCountAggregateOutputType | null
    _min: WorkflowExecutionMinAggregateOutputType | null
    _max: WorkflowExecutionMaxAggregateOutputType | null
  }

  export type WorkflowExecutionMinAggregateOutputType = {
    id: string | null
    orgId: string | null
    workflowType: string | null
    entityId: string | null
    entityType: string | null
    currentState: string | null
    status: $Enums.WorkflowStatus | null
    startedAt: Date | null
    completedAt: Date | null
    errorMessage: string | null
  }

  export type WorkflowExecutionMaxAggregateOutputType = {
    id: string | null
    orgId: string | null
    workflowType: string | null
    entityId: string | null
    entityType: string | null
    currentState: string | null
    status: $Enums.WorkflowStatus | null
    startedAt: Date | null
    completedAt: Date | null
    errorMessage: string | null
  }

  export type WorkflowExecutionCountAggregateOutputType = {
    id: number
    orgId: number
    workflowType: number
    entityId: number
    entityType: number
    currentState: number
    stateData: number
    status: number
    startedAt: number
    completedAt: number
    errorMessage: number
    checkpoints: number
    _all: number
  }


  export type WorkflowExecutionMinAggregateInputType = {
    id?: true
    orgId?: true
    workflowType?: true
    entityId?: true
    entityType?: true
    currentState?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
  }

  export type WorkflowExecutionMaxAggregateInputType = {
    id?: true
    orgId?: true
    workflowType?: true
    entityId?: true
    entityType?: true
    currentState?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
  }

  export type WorkflowExecutionCountAggregateInputType = {
    id?: true
    orgId?: true
    workflowType?: true
    entityId?: true
    entityType?: true
    currentState?: true
    stateData?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
    checkpoints?: true
    _all?: true
  }

  export type WorkflowExecutionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowExecution to aggregate.
     */
    where?: WorkflowExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowExecutions to fetch.
     */
    orderBy?: WorkflowExecutionOrderByWithRelationInput | WorkflowExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowExecutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkflowExecutions
    **/
    _count?: true | WorkflowExecutionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowExecutionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowExecutionMaxAggregateInputType
  }

  export type GetWorkflowExecutionAggregateType<T extends WorkflowExecutionAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflowExecution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflowExecution[P]>
      : GetScalarType<T[P], AggregateWorkflowExecution[P]>
  }




  export type WorkflowExecutionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowExecutionWhereInput
    orderBy?: WorkflowExecutionOrderByWithAggregationInput | WorkflowExecutionOrderByWithAggregationInput[]
    by: WorkflowExecutionScalarFieldEnum[] | WorkflowExecutionScalarFieldEnum
    having?: WorkflowExecutionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowExecutionCountAggregateInputType | true
    _min?: WorkflowExecutionMinAggregateInputType
    _max?: WorkflowExecutionMaxAggregateInputType
  }

  export type WorkflowExecutionGroupByOutputType = {
    id: string
    orgId: string
    workflowType: string
    entityId: string
    entityType: string
    currentState: string
    stateData: JsonValue
    status: $Enums.WorkflowStatus
    startedAt: Date
    completedAt: Date | null
    errorMessage: string | null
    checkpoints: JsonValue | null
    _count: WorkflowExecutionCountAggregateOutputType | null
    _min: WorkflowExecutionMinAggregateOutputType | null
    _max: WorkflowExecutionMaxAggregateOutputType | null
  }

  type GetWorkflowExecutionGroupByPayload<T extends WorkflowExecutionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowExecutionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowExecutionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowExecutionGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowExecutionGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowExecutionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    workflowType?: boolean
    entityId?: boolean
    entityType?: boolean
    currentState?: boolean
    stateData?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    checkpoints?: boolean
  }, ExtArgs["result"]["workflowExecution"]>

  export type WorkflowExecutionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgId?: boolean
    workflowType?: boolean
    entityId?: boolean
    entityType?: boolean
    currentState?: boolean
    stateData?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    checkpoints?: boolean
  }, ExtArgs["result"]["workflowExecution"]>

  export type WorkflowExecutionSelectScalar = {
    id?: boolean
    orgId?: boolean
    workflowType?: boolean
    entityId?: boolean
    entityType?: boolean
    currentState?: boolean
    stateData?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    checkpoints?: boolean
  }


  export type $WorkflowExecutionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkflowExecution"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgId: string
      workflowType: string
      entityId: string
      entityType: string
      currentState: string
      stateData: Prisma.JsonValue
      status: $Enums.WorkflowStatus
      startedAt: Date
      completedAt: Date | null
      errorMessage: string | null
      checkpoints: Prisma.JsonValue | null
    }, ExtArgs["result"]["workflowExecution"]>
    composites: {}
  }

  type WorkflowExecutionGetPayload<S extends boolean | null | undefined | WorkflowExecutionDefaultArgs> = $Result.GetResult<Prisma.$WorkflowExecutionPayload, S>

  type WorkflowExecutionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowExecutionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowExecutionCountAggregateInputType | true
    }

  export interface WorkflowExecutionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkflowExecution'], meta: { name: 'WorkflowExecution' } }
    /**
     * Find zero or one WorkflowExecution that matches the filter.
     * @param {WorkflowExecutionFindUniqueArgs} args - Arguments to find a WorkflowExecution
     * @example
     * // Get one WorkflowExecution
     * const workflowExecution = await prisma.workflowExecution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowExecutionFindUniqueArgs>(args: SelectSubset<T, WorkflowExecutionFindUniqueArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkflowExecution that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowExecutionFindUniqueOrThrowArgs} args - Arguments to find a WorkflowExecution
     * @example
     * // Get one WorkflowExecution
     * const workflowExecution = await prisma.workflowExecution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowExecutionFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowExecutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkflowExecution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionFindFirstArgs} args - Arguments to find a WorkflowExecution
     * @example
     * // Get one WorkflowExecution
     * const workflowExecution = await prisma.workflowExecution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowExecutionFindFirstArgs>(args?: SelectSubset<T, WorkflowExecutionFindFirstArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkflowExecution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionFindFirstOrThrowArgs} args - Arguments to find a WorkflowExecution
     * @example
     * // Get one WorkflowExecution
     * const workflowExecution = await prisma.workflowExecution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowExecutionFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowExecutionFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkflowExecutions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkflowExecutions
     * const workflowExecutions = await prisma.workflowExecution.findMany()
     * 
     * // Get first 10 WorkflowExecutions
     * const workflowExecutions = await prisma.workflowExecution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowExecutionWithIdOnly = await prisma.workflowExecution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowExecutionFindManyArgs>(args?: SelectSubset<T, WorkflowExecutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkflowExecution.
     * @param {WorkflowExecutionCreateArgs} args - Arguments to create a WorkflowExecution.
     * @example
     * // Create one WorkflowExecution
     * const WorkflowExecution = await prisma.workflowExecution.create({
     *   data: {
     *     // ... data to create a WorkflowExecution
     *   }
     * })
     * 
     */
    create<T extends WorkflowExecutionCreateArgs>(args: SelectSubset<T, WorkflowExecutionCreateArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkflowExecutions.
     * @param {WorkflowExecutionCreateManyArgs} args - Arguments to create many WorkflowExecutions.
     * @example
     * // Create many WorkflowExecutions
     * const workflowExecution = await prisma.workflowExecution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowExecutionCreateManyArgs>(args?: SelectSubset<T, WorkflowExecutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkflowExecutions and returns the data saved in the database.
     * @param {WorkflowExecutionCreateManyAndReturnArgs} args - Arguments to create many WorkflowExecutions.
     * @example
     * // Create many WorkflowExecutions
     * const workflowExecution = await prisma.workflowExecution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkflowExecutions and only return the `id`
     * const workflowExecutionWithIdOnly = await prisma.workflowExecution.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowExecutionCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowExecutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkflowExecution.
     * @param {WorkflowExecutionDeleteArgs} args - Arguments to delete one WorkflowExecution.
     * @example
     * // Delete one WorkflowExecution
     * const WorkflowExecution = await prisma.workflowExecution.delete({
     *   where: {
     *     // ... filter to delete one WorkflowExecution
     *   }
     * })
     * 
     */
    delete<T extends WorkflowExecutionDeleteArgs>(args: SelectSubset<T, WorkflowExecutionDeleteArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkflowExecution.
     * @param {WorkflowExecutionUpdateArgs} args - Arguments to update one WorkflowExecution.
     * @example
     * // Update one WorkflowExecution
     * const workflowExecution = await prisma.workflowExecution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowExecutionUpdateArgs>(args: SelectSubset<T, WorkflowExecutionUpdateArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkflowExecutions.
     * @param {WorkflowExecutionDeleteManyArgs} args - Arguments to filter WorkflowExecutions to delete.
     * @example
     * // Delete a few WorkflowExecutions
     * const { count } = await prisma.workflowExecution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowExecutionDeleteManyArgs>(args?: SelectSubset<T, WorkflowExecutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkflowExecutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkflowExecutions
     * const workflowExecution = await prisma.workflowExecution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowExecutionUpdateManyArgs>(args: SelectSubset<T, WorkflowExecutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkflowExecution.
     * @param {WorkflowExecutionUpsertArgs} args - Arguments to update or create a WorkflowExecution.
     * @example
     * // Update or create a WorkflowExecution
     * const workflowExecution = await prisma.workflowExecution.upsert({
     *   create: {
     *     // ... data to create a WorkflowExecution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkflowExecution we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowExecutionUpsertArgs>(args: SelectSubset<T, WorkflowExecutionUpsertArgs<ExtArgs>>): Prisma__WorkflowExecutionClient<$Result.GetResult<Prisma.$WorkflowExecutionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkflowExecutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionCountArgs} args - Arguments to filter WorkflowExecutions to count.
     * @example
     * // Count the number of WorkflowExecutions
     * const count = await prisma.workflowExecution.count({
     *   where: {
     *     // ... the filter for the WorkflowExecutions we want to count
     *   }
     * })
    **/
    count<T extends WorkflowExecutionCountArgs>(
      args?: Subset<T, WorkflowExecutionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowExecutionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkflowExecution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowExecutionAggregateArgs>(args: Subset<T, WorkflowExecutionAggregateArgs>): Prisma.PrismaPromise<GetWorkflowExecutionAggregateType<T>>

    /**
     * Group by WorkflowExecution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowExecutionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowExecutionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowExecutionGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowExecutionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowExecutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowExecutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkflowExecution model
   */
  readonly fields: WorkflowExecutionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkflowExecution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowExecutionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkflowExecution model
   */ 
  interface WorkflowExecutionFieldRefs {
    readonly id: FieldRef<"WorkflowExecution", 'String'>
    readonly orgId: FieldRef<"WorkflowExecution", 'String'>
    readonly workflowType: FieldRef<"WorkflowExecution", 'String'>
    readonly entityId: FieldRef<"WorkflowExecution", 'String'>
    readonly entityType: FieldRef<"WorkflowExecution", 'String'>
    readonly currentState: FieldRef<"WorkflowExecution", 'String'>
    readonly stateData: FieldRef<"WorkflowExecution", 'Json'>
    readonly status: FieldRef<"WorkflowExecution", 'WorkflowStatus'>
    readonly startedAt: FieldRef<"WorkflowExecution", 'DateTime'>
    readonly completedAt: FieldRef<"WorkflowExecution", 'DateTime'>
    readonly errorMessage: FieldRef<"WorkflowExecution", 'String'>
    readonly checkpoints: FieldRef<"WorkflowExecution", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * WorkflowExecution findUnique
   */
  export type WorkflowExecutionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * Filter, which WorkflowExecution to fetch.
     */
    where: WorkflowExecutionWhereUniqueInput
  }

  /**
   * WorkflowExecution findUniqueOrThrow
   */
  export type WorkflowExecutionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * Filter, which WorkflowExecution to fetch.
     */
    where: WorkflowExecutionWhereUniqueInput
  }

  /**
   * WorkflowExecution findFirst
   */
  export type WorkflowExecutionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * Filter, which WorkflowExecution to fetch.
     */
    where?: WorkflowExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowExecutions to fetch.
     */
    orderBy?: WorkflowExecutionOrderByWithRelationInput | WorkflowExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowExecutions.
     */
    cursor?: WorkflowExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowExecutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowExecutions.
     */
    distinct?: WorkflowExecutionScalarFieldEnum | WorkflowExecutionScalarFieldEnum[]
  }

  /**
   * WorkflowExecution findFirstOrThrow
   */
  export type WorkflowExecutionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * Filter, which WorkflowExecution to fetch.
     */
    where?: WorkflowExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowExecutions to fetch.
     */
    orderBy?: WorkflowExecutionOrderByWithRelationInput | WorkflowExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowExecutions.
     */
    cursor?: WorkflowExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowExecutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowExecutions.
     */
    distinct?: WorkflowExecutionScalarFieldEnum | WorkflowExecutionScalarFieldEnum[]
  }

  /**
   * WorkflowExecution findMany
   */
  export type WorkflowExecutionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * Filter, which WorkflowExecutions to fetch.
     */
    where?: WorkflowExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowExecutions to fetch.
     */
    orderBy?: WorkflowExecutionOrderByWithRelationInput | WorkflowExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkflowExecutions.
     */
    cursor?: WorkflowExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowExecutions.
     */
    skip?: number
    distinct?: WorkflowExecutionScalarFieldEnum | WorkflowExecutionScalarFieldEnum[]
  }

  /**
   * WorkflowExecution create
   */
  export type WorkflowExecutionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * The data needed to create a WorkflowExecution.
     */
    data: XOR<WorkflowExecutionCreateInput, WorkflowExecutionUncheckedCreateInput>
  }

  /**
   * WorkflowExecution createMany
   */
  export type WorkflowExecutionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkflowExecutions.
     */
    data: WorkflowExecutionCreateManyInput | WorkflowExecutionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowExecution createManyAndReturn
   */
  export type WorkflowExecutionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkflowExecutions.
     */
    data: WorkflowExecutionCreateManyInput | WorkflowExecutionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowExecution update
   */
  export type WorkflowExecutionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * The data needed to update a WorkflowExecution.
     */
    data: XOR<WorkflowExecutionUpdateInput, WorkflowExecutionUncheckedUpdateInput>
    /**
     * Choose, which WorkflowExecution to update.
     */
    where: WorkflowExecutionWhereUniqueInput
  }

  /**
   * WorkflowExecution updateMany
   */
  export type WorkflowExecutionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkflowExecutions.
     */
    data: XOR<WorkflowExecutionUpdateManyMutationInput, WorkflowExecutionUncheckedUpdateManyInput>
    /**
     * Filter which WorkflowExecutions to update
     */
    where?: WorkflowExecutionWhereInput
  }

  /**
   * WorkflowExecution upsert
   */
  export type WorkflowExecutionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * The filter to search for the WorkflowExecution to update in case it exists.
     */
    where: WorkflowExecutionWhereUniqueInput
    /**
     * In case the WorkflowExecution found by the `where` argument doesn't exist, create a new WorkflowExecution with this data.
     */
    create: XOR<WorkflowExecutionCreateInput, WorkflowExecutionUncheckedCreateInput>
    /**
     * In case the WorkflowExecution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowExecutionUpdateInput, WorkflowExecutionUncheckedUpdateInput>
  }

  /**
   * WorkflowExecution delete
   */
  export type WorkflowExecutionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
    /**
     * Filter which WorkflowExecution to delete.
     */
    where: WorkflowExecutionWhereUniqueInput
  }

  /**
   * WorkflowExecution deleteMany
   */
  export type WorkflowExecutionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowExecutions to delete
     */
    where?: WorkflowExecutionWhereInput
  }

  /**
   * WorkflowExecution without action
   */
  export type WorkflowExecutionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowExecution
     */
    select?: WorkflowExecutionSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    logo: 'logo',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatar: 'avatar',
    role: 'role',
    isActive: 'isActive',
    orgId: 'orgId',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VendorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    website: 'website',
    address: 'address',
    orgId: 'orgId',
    metadata: 'metadata',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum]


  export const ProcurementRequestScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    items: 'items',
    status: 'status',
    priority: 'priority',
    orgId: 'orgId',
    createdBy: 'createdBy',
    approvedVendorId: 'approvedVendorId',
    approvedQuoteId: 'approvedQuoteId',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    requestedBy: 'requestedBy',
    approvedAt: 'approvedAt',
    completedAt: 'completedAt'
  };

  export type ProcurementRequestScalarFieldEnum = (typeof ProcurementRequestScalarFieldEnum)[keyof typeof ProcurementRequestScalarFieldEnum]


  export const QuoteScalarFieldEnum: {
    id: 'id',
    orgId: 'orgId',
    requestId: 'requestId',
    vendorId: 'vendorId',
    items: 'items',
    totalAmount: 'totalAmount',
    currency: 'currency',
    deliveryDays: 'deliveryDays',
    validUntil: 'validUntil',
    terms: 'terms',
    source: 'source',
    rawData: 'rawData',
    confidence: 'confidence',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuoteScalarFieldEnum = (typeof QuoteScalarFieldEnum)[keyof typeof QuoteScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    orgId: 'orgId',
    requestId: 'requestId',
    quoteId: 'quoteId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    stripePaymentIntentId: 'stripePaymentIntentId',
    stripeChargeId: 'stripeChargeId',
    method: 'method',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    paidAt: 'paidAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    orgId: 'orgId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    userId: 'userId',
    oldValues: 'oldValues',
    newValues: 'newValues',
    metadata: 'metadata',
    createdAt: 'createdAt',
    requestId: 'requestId'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const EmailThreadScalarFieldEnum: {
    id: 'id',
    orgId: 'orgId',
    gmailThreadId: 'gmailThreadId',
    subject: 'subject',
    participants: 'participants',
    requestId: 'requestId',
    lastMessageAt: 'lastMessageAt',
    messageCount: 'messageCount',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EmailThreadScalarFieldEnum = (typeof EmailThreadScalarFieldEnum)[keyof typeof EmailThreadScalarFieldEnum]


  export const EmailMessageScalarFieldEnum: {
    id: 'id',
    threadId: 'threadId',
    gmailMessageId: 'gmailMessageId',
    sender: 'sender',
    to: 'to',
    subject: 'subject',
    body: 'body',
    isProcessed: 'isProcessed',
    extractedData: 'extractedData',
    attachments: 'attachments',
    createdAt: 'createdAt',
    receivedAt: 'receivedAt'
  };

  export type EmailMessageScalarFieldEnum = (typeof EmailMessageScalarFieldEnum)[keyof typeof EmailMessageScalarFieldEnum]


  export const WorkflowExecutionScalarFieldEnum: {
    id: 'id',
    orgId: 'orgId',
    workflowType: 'workflowType',
    entityId: 'entityId',
    entityType: 'entityType',
    currentState: 'currentState',
    stateData: 'stateData',
    status: 'status',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    errorMessage: 'errorMessage',
    checkpoints: 'checkpoints'
  };

  export type WorkflowExecutionScalarFieldEnum = (typeof WorkflowExecutionScalarFieldEnum)[keyof typeof WorkflowExecutionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'RequestStatus'
   */
  export type EnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus'>
    


  /**
   * Reference to a field of type 'RequestStatus[]'
   */
  export type ListEnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus[]'>
    


  /**
   * Reference to a field of type 'RequestPriority'
   */
  export type EnumRequestPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestPriority'>
    


  /**
   * Reference to a field of type 'RequestPriority[]'
   */
  export type ListEnumRequestPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestPriority[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'QuoteSource'
   */
  export type EnumQuoteSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuoteSource'>
    


  /**
   * Reference to a field of type 'QuoteSource[]'
   */
  export type ListEnumQuoteSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuoteSource[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'QuoteStatus'
   */
  export type EnumQuoteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuoteStatus'>
    


  /**
   * Reference to a field of type 'QuoteStatus[]'
   */
  export type ListEnumQuoteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuoteStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'WorkflowStatus'
   */
  export type EnumWorkflowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkflowStatus'>
    


  /**
   * Reference to a field of type 'WorkflowStatus[]'
   */
  export type ListEnumWorkflowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkflowStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    slug?: StringFilter<"Organization"> | string
    logo?: StringNullableFilter<"Organization"> | string | null
    metadata?: JsonNullableFilter<"Organization">
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    users?: UserListRelationFilter
    vendors?: VendorListRelationFilter
    requests?: ProcurementRequestListRelationFilter
    quotes?: QuoteListRelationFilter
    payments?: PaymentListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    vendors?: VendorOrderByRelationAggregateInput
    requests?: ProcurementRequestOrderByRelationAggregateInput
    quotes?: QuoteOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    logo?: StringNullableFilter<"Organization"> | string | null
    metadata?: JsonNullableFilter<"Organization">
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    users?: UserListRelationFilter
    vendors?: VendorListRelationFilter
    requests?: ProcurementRequestListRelationFilter
    quotes?: QuoteListRelationFilter
    payments?: PaymentListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "slug">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    slug?: StringWithAggregatesFilter<"Organization"> | string
    logo?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Organization">
    createdAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    orgId?: StringFilter<"User"> | string
    metadata?: JsonNullableFilter<"User">
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    createdRequests?: ProcurementRequestListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    orgId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    createdRequests?: ProcurementRequestOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    orgId?: StringFilter<"User"> | string
    metadata?: JsonNullableFilter<"User">
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    createdRequests?: ProcurementRequestListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    orgId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    orgId?: StringWithAggregatesFilter<"User"> | string
    metadata?: JsonNullableWithAggregatesFilter<"User">
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    id?: StringFilter<"Vendor"> | string
    name?: StringFilter<"Vendor"> | string
    email?: StringFilter<"Vendor"> | string
    phone?: StringNullableFilter<"Vendor"> | string | null
    website?: StringNullableFilter<"Vendor"> | string | null
    address?: JsonNullableFilter<"Vendor">
    orgId?: StringFilter<"Vendor"> | string
    metadata?: JsonNullableFilter<"Vendor">
    isActive?: BoolFilter<"Vendor"> | boolean
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    quotes?: QuoteListRelationFilter
  }

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    orgId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    quotes?: QuoteOrderByRelationAggregateInput
  }

  export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    name?: StringFilter<"Vendor"> | string
    email?: StringFilter<"Vendor"> | string
    phone?: StringNullableFilter<"Vendor"> | string | null
    website?: StringNullableFilter<"Vendor"> | string | null
    address?: JsonNullableFilter<"Vendor">
    orgId?: StringFilter<"Vendor"> | string
    metadata?: JsonNullableFilter<"Vendor">
    isActive?: BoolFilter<"Vendor"> | boolean
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    quotes?: QuoteListRelationFilter
  }, "id">

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    orgId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VendorCountOrderByAggregateInput
    _max?: VendorMaxOrderByAggregateInput
    _min?: VendorMinOrderByAggregateInput
  }

  export type VendorScalarWhereWithAggregatesInput = {
    AND?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    OR?: VendorScalarWhereWithAggregatesInput[]
    NOT?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vendor"> | string
    name?: StringWithAggregatesFilter<"Vendor"> | string
    email?: StringWithAggregatesFilter<"Vendor"> | string
    phone?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    website?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    address?: JsonNullableWithAggregatesFilter<"Vendor">
    orgId?: StringWithAggregatesFilter<"Vendor"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Vendor">
    isActive?: BoolWithAggregatesFilter<"Vendor"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
  }

  export type ProcurementRequestWhereInput = {
    AND?: ProcurementRequestWhereInput | ProcurementRequestWhereInput[]
    OR?: ProcurementRequestWhereInput[]
    NOT?: ProcurementRequestWhereInput | ProcurementRequestWhereInput[]
    id?: StringFilter<"ProcurementRequest"> | string
    title?: StringFilter<"ProcurementRequest"> | string
    description?: StringNullableFilter<"ProcurementRequest"> | string | null
    items?: JsonFilter<"ProcurementRequest">
    status?: EnumRequestStatusFilter<"ProcurementRequest"> | $Enums.RequestStatus
    priority?: EnumRequestPriorityFilter<"ProcurementRequest"> | $Enums.RequestPriority
    orgId?: StringFilter<"ProcurementRequest"> | string
    createdBy?: StringFilter<"ProcurementRequest"> | string
    approvedVendorId?: StringNullableFilter<"ProcurementRequest"> | string | null
    approvedQuoteId?: StringNullableFilter<"ProcurementRequest"> | string | null
    metadata?: JsonNullableFilter<"ProcurementRequest">
    createdAt?: DateTimeFilter<"ProcurementRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ProcurementRequest"> | Date | string
    requestedBy?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    creator?: XOR<UserRelationFilter, UserWhereInput>
    quotes?: QuoteListRelationFilter
    payments?: PaymentListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type ProcurementRequestOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    items?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    orgId?: SortOrder
    createdBy?: SortOrder
    approvedVendorId?: SortOrderInput | SortOrder
    approvedQuoteId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requestedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    organization?: OrganizationOrderByWithRelationInput
    creator?: UserOrderByWithRelationInput
    quotes?: QuoteOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type ProcurementRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProcurementRequestWhereInput | ProcurementRequestWhereInput[]
    OR?: ProcurementRequestWhereInput[]
    NOT?: ProcurementRequestWhereInput | ProcurementRequestWhereInput[]
    title?: StringFilter<"ProcurementRequest"> | string
    description?: StringNullableFilter<"ProcurementRequest"> | string | null
    items?: JsonFilter<"ProcurementRequest">
    status?: EnumRequestStatusFilter<"ProcurementRequest"> | $Enums.RequestStatus
    priority?: EnumRequestPriorityFilter<"ProcurementRequest"> | $Enums.RequestPriority
    orgId?: StringFilter<"ProcurementRequest"> | string
    createdBy?: StringFilter<"ProcurementRequest"> | string
    approvedVendorId?: StringNullableFilter<"ProcurementRequest"> | string | null
    approvedQuoteId?: StringNullableFilter<"ProcurementRequest"> | string | null
    metadata?: JsonNullableFilter<"ProcurementRequest">
    createdAt?: DateTimeFilter<"ProcurementRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ProcurementRequest"> | Date | string
    requestedBy?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    creator?: XOR<UserRelationFilter, UserWhereInput>
    quotes?: QuoteListRelationFilter
    payments?: PaymentListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id">

  export type ProcurementRequestOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    items?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    orgId?: SortOrder
    createdBy?: SortOrder
    approvedVendorId?: SortOrderInput | SortOrder
    approvedQuoteId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requestedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: ProcurementRequestCountOrderByAggregateInput
    _max?: ProcurementRequestMaxOrderByAggregateInput
    _min?: ProcurementRequestMinOrderByAggregateInput
  }

  export type ProcurementRequestScalarWhereWithAggregatesInput = {
    AND?: ProcurementRequestScalarWhereWithAggregatesInput | ProcurementRequestScalarWhereWithAggregatesInput[]
    OR?: ProcurementRequestScalarWhereWithAggregatesInput[]
    NOT?: ProcurementRequestScalarWhereWithAggregatesInput | ProcurementRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProcurementRequest"> | string
    title?: StringWithAggregatesFilter<"ProcurementRequest"> | string
    description?: StringNullableWithAggregatesFilter<"ProcurementRequest"> | string | null
    items?: JsonWithAggregatesFilter<"ProcurementRequest">
    status?: EnumRequestStatusWithAggregatesFilter<"ProcurementRequest"> | $Enums.RequestStatus
    priority?: EnumRequestPriorityWithAggregatesFilter<"ProcurementRequest"> | $Enums.RequestPriority
    orgId?: StringWithAggregatesFilter<"ProcurementRequest"> | string
    createdBy?: StringWithAggregatesFilter<"ProcurementRequest"> | string
    approvedVendorId?: StringNullableWithAggregatesFilter<"ProcurementRequest"> | string | null
    approvedQuoteId?: StringNullableWithAggregatesFilter<"ProcurementRequest"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"ProcurementRequest">
    createdAt?: DateTimeWithAggregatesFilter<"ProcurementRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProcurementRequest"> | Date | string
    requestedBy?: DateTimeNullableWithAggregatesFilter<"ProcurementRequest"> | Date | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"ProcurementRequest"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"ProcurementRequest"> | Date | string | null
  }

  export type QuoteWhereInput = {
    AND?: QuoteWhereInput | QuoteWhereInput[]
    OR?: QuoteWhereInput[]
    NOT?: QuoteWhereInput | QuoteWhereInput[]
    id?: StringFilter<"Quote"> | string
    orgId?: StringFilter<"Quote"> | string
    requestId?: StringFilter<"Quote"> | string
    vendorId?: StringFilter<"Quote"> | string
    items?: JsonFilter<"Quote">
    totalAmount?: DecimalFilter<"Quote"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Quote"> | string
    deliveryDays?: IntNullableFilter<"Quote"> | number | null
    validUntil?: DateTimeNullableFilter<"Quote"> | Date | string | null
    terms?: JsonNullableFilter<"Quote">
    source?: EnumQuoteSourceFilter<"Quote"> | $Enums.QuoteSource
    rawData?: JsonNullableFilter<"Quote">
    confidence?: FloatNullableFilter<"Quote"> | number | null
    status?: EnumQuoteStatusFilter<"Quote"> | $Enums.QuoteStatus
    createdAt?: DateTimeFilter<"Quote"> | Date | string
    updatedAt?: DateTimeFilter<"Quote"> | Date | string
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    request?: XOR<ProcurementRequestRelationFilter, ProcurementRequestWhereInput>
    vendor?: XOR<VendorRelationFilter, VendorWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type QuoteOrderByWithRelationInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    vendorId?: SortOrder
    items?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    deliveryDays?: SortOrderInput | SortOrder
    validUntil?: SortOrderInput | SortOrder
    terms?: SortOrderInput | SortOrder
    source?: SortOrder
    rawData?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    request?: ProcurementRequestOrderByWithRelationInput
    vendor?: VendorOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type QuoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuoteWhereInput | QuoteWhereInput[]
    OR?: QuoteWhereInput[]
    NOT?: QuoteWhereInput | QuoteWhereInput[]
    orgId?: StringFilter<"Quote"> | string
    requestId?: StringFilter<"Quote"> | string
    vendorId?: StringFilter<"Quote"> | string
    items?: JsonFilter<"Quote">
    totalAmount?: DecimalFilter<"Quote"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Quote"> | string
    deliveryDays?: IntNullableFilter<"Quote"> | number | null
    validUntil?: DateTimeNullableFilter<"Quote"> | Date | string | null
    terms?: JsonNullableFilter<"Quote">
    source?: EnumQuoteSourceFilter<"Quote"> | $Enums.QuoteSource
    rawData?: JsonNullableFilter<"Quote">
    confidence?: FloatNullableFilter<"Quote"> | number | null
    status?: EnumQuoteStatusFilter<"Quote"> | $Enums.QuoteStatus
    createdAt?: DateTimeFilter<"Quote"> | Date | string
    updatedAt?: DateTimeFilter<"Quote"> | Date | string
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    request?: XOR<ProcurementRequestRelationFilter, ProcurementRequestWhereInput>
    vendor?: XOR<VendorRelationFilter, VendorWhereInput>
    payments?: PaymentListRelationFilter
  }, "id">

  export type QuoteOrderByWithAggregationInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    vendorId?: SortOrder
    items?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    deliveryDays?: SortOrderInput | SortOrder
    validUntil?: SortOrderInput | SortOrder
    terms?: SortOrderInput | SortOrder
    source?: SortOrder
    rawData?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuoteCountOrderByAggregateInput
    _avg?: QuoteAvgOrderByAggregateInput
    _max?: QuoteMaxOrderByAggregateInput
    _min?: QuoteMinOrderByAggregateInput
    _sum?: QuoteSumOrderByAggregateInput
  }

  export type QuoteScalarWhereWithAggregatesInput = {
    AND?: QuoteScalarWhereWithAggregatesInput | QuoteScalarWhereWithAggregatesInput[]
    OR?: QuoteScalarWhereWithAggregatesInput[]
    NOT?: QuoteScalarWhereWithAggregatesInput | QuoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quote"> | string
    orgId?: StringWithAggregatesFilter<"Quote"> | string
    requestId?: StringWithAggregatesFilter<"Quote"> | string
    vendorId?: StringWithAggregatesFilter<"Quote"> | string
    items?: JsonWithAggregatesFilter<"Quote">
    totalAmount?: DecimalWithAggregatesFilter<"Quote"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Quote"> | string
    deliveryDays?: IntNullableWithAggregatesFilter<"Quote"> | number | null
    validUntil?: DateTimeNullableWithAggregatesFilter<"Quote"> | Date | string | null
    terms?: JsonNullableWithAggregatesFilter<"Quote">
    source?: EnumQuoteSourceWithAggregatesFilter<"Quote"> | $Enums.QuoteSource
    rawData?: JsonNullableWithAggregatesFilter<"Quote">
    confidence?: FloatNullableWithAggregatesFilter<"Quote"> | number | null
    status?: EnumQuoteStatusWithAggregatesFilter<"Quote"> | $Enums.QuoteStatus
    createdAt?: DateTimeWithAggregatesFilter<"Quote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Quote"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    orgId?: StringFilter<"Payment"> | string
    requestId?: StringFilter<"Payment"> | string
    quoteId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    stripePaymentIntentId?: StringNullableFilter<"Payment"> | string | null
    stripeChargeId?: StringNullableFilter<"Payment"> | string | null
    method?: StringNullableFilter<"Payment"> | string | null
    metadata?: JsonNullableFilter<"Payment">
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    paidAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    request?: XOR<ProcurementRequestRelationFilter, ProcurementRequestWhereInput>
    quote?: XOR<QuoteRelationFilter, QuoteWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    quoteId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    stripePaymentIntentId?: SortOrderInput | SortOrder
    stripeChargeId?: SortOrderInput | SortOrder
    method?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    organization?: OrganizationOrderByWithRelationInput
    request?: ProcurementRequestOrderByWithRelationInput
    quote?: QuoteOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    orgId?: StringFilter<"Payment"> | string
    requestId?: StringFilter<"Payment"> | string
    quoteId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    stripePaymentIntentId?: StringNullableFilter<"Payment"> | string | null
    stripeChargeId?: StringNullableFilter<"Payment"> | string | null
    method?: StringNullableFilter<"Payment"> | string | null
    metadata?: JsonNullableFilter<"Payment">
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    paidAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    request?: XOR<ProcurementRequestRelationFilter, ProcurementRequestWhereInput>
    quote?: XOR<QuoteRelationFilter, QuoteWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    quoteId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    stripePaymentIntentId?: SortOrderInput | SortOrder
    stripeChargeId?: SortOrderInput | SortOrder
    method?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    orgId?: StringWithAggregatesFilter<"Payment"> | string
    requestId?: StringWithAggregatesFilter<"Payment"> | string
    quoteId?: StringWithAggregatesFilter<"Payment"> | string
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Payment"> | string
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    stripePaymentIntentId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    stripeChargeId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    method?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Payment">
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    paidAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    orgId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    requestId?: StringNullableFilter<"AuditLog"> | string | null
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    request?: XOR<ProcurementRequestNullableRelationFilter, ProcurementRequestWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    orgId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrderInput | SortOrder
    oldValues?: SortOrderInput | SortOrder
    newValues?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    requestId?: SortOrderInput | SortOrder
    organization?: OrganizationOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    request?: ProcurementRequestOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    orgId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    requestId?: StringNullableFilter<"AuditLog"> | string | null
    organization?: XOR<OrganizationRelationFilter, OrganizationWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    request?: XOR<ProcurementRequestNullableRelationFilter, ProcurementRequestWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    orgId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrderInput | SortOrder
    oldValues?: SortOrderInput | SortOrder
    newValues?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    requestId?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    orgId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableWithAggregatesFilter<"AuditLog">
    newValues?: JsonNullableWithAggregatesFilter<"AuditLog">
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    requestId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
  }

  export type EmailThreadWhereInput = {
    AND?: EmailThreadWhereInput | EmailThreadWhereInput[]
    OR?: EmailThreadWhereInput[]
    NOT?: EmailThreadWhereInput | EmailThreadWhereInput[]
    id?: StringFilter<"EmailThread"> | string
    orgId?: StringFilter<"EmailThread"> | string
    gmailThreadId?: StringFilter<"EmailThread"> | string
    subject?: StringFilter<"EmailThread"> | string
    participants?: JsonFilter<"EmailThread">
    requestId?: StringNullableFilter<"EmailThread"> | string | null
    lastMessageAt?: DateTimeFilter<"EmailThread"> | Date | string
    messageCount?: IntFilter<"EmailThread"> | number
    metadata?: JsonNullableFilter<"EmailThread">
    createdAt?: DateTimeFilter<"EmailThread"> | Date | string
    updatedAt?: DateTimeFilter<"EmailThread"> | Date | string
    messages?: EmailMessageListRelationFilter
  }

  export type EmailThreadOrderByWithRelationInput = {
    id?: SortOrder
    orgId?: SortOrder
    gmailThreadId?: SortOrder
    subject?: SortOrder
    participants?: SortOrder
    requestId?: SortOrderInput | SortOrder
    lastMessageAt?: SortOrder
    messageCount?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: EmailMessageOrderByRelationAggregateInput
  }

  export type EmailThreadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gmailThreadId?: string
    AND?: EmailThreadWhereInput | EmailThreadWhereInput[]
    OR?: EmailThreadWhereInput[]
    NOT?: EmailThreadWhereInput | EmailThreadWhereInput[]
    orgId?: StringFilter<"EmailThread"> | string
    subject?: StringFilter<"EmailThread"> | string
    participants?: JsonFilter<"EmailThread">
    requestId?: StringNullableFilter<"EmailThread"> | string | null
    lastMessageAt?: DateTimeFilter<"EmailThread"> | Date | string
    messageCount?: IntFilter<"EmailThread"> | number
    metadata?: JsonNullableFilter<"EmailThread">
    createdAt?: DateTimeFilter<"EmailThread"> | Date | string
    updatedAt?: DateTimeFilter<"EmailThread"> | Date | string
    messages?: EmailMessageListRelationFilter
  }, "id" | "gmailThreadId">

  export type EmailThreadOrderByWithAggregationInput = {
    id?: SortOrder
    orgId?: SortOrder
    gmailThreadId?: SortOrder
    subject?: SortOrder
    participants?: SortOrder
    requestId?: SortOrderInput | SortOrder
    lastMessageAt?: SortOrder
    messageCount?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EmailThreadCountOrderByAggregateInput
    _avg?: EmailThreadAvgOrderByAggregateInput
    _max?: EmailThreadMaxOrderByAggregateInput
    _min?: EmailThreadMinOrderByAggregateInput
    _sum?: EmailThreadSumOrderByAggregateInput
  }

  export type EmailThreadScalarWhereWithAggregatesInput = {
    AND?: EmailThreadScalarWhereWithAggregatesInput | EmailThreadScalarWhereWithAggregatesInput[]
    OR?: EmailThreadScalarWhereWithAggregatesInput[]
    NOT?: EmailThreadScalarWhereWithAggregatesInput | EmailThreadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailThread"> | string
    orgId?: StringWithAggregatesFilter<"EmailThread"> | string
    gmailThreadId?: StringWithAggregatesFilter<"EmailThread"> | string
    subject?: StringWithAggregatesFilter<"EmailThread"> | string
    participants?: JsonWithAggregatesFilter<"EmailThread">
    requestId?: StringNullableWithAggregatesFilter<"EmailThread"> | string | null
    lastMessageAt?: DateTimeWithAggregatesFilter<"EmailThread"> | Date | string
    messageCount?: IntWithAggregatesFilter<"EmailThread"> | number
    metadata?: JsonNullableWithAggregatesFilter<"EmailThread">
    createdAt?: DateTimeWithAggregatesFilter<"EmailThread"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EmailThread"> | Date | string
  }

  export type EmailMessageWhereInput = {
    AND?: EmailMessageWhereInput | EmailMessageWhereInput[]
    OR?: EmailMessageWhereInput[]
    NOT?: EmailMessageWhereInput | EmailMessageWhereInput[]
    id?: StringFilter<"EmailMessage"> | string
    threadId?: StringFilter<"EmailMessage"> | string
    gmailMessageId?: StringFilter<"EmailMessage"> | string
    sender?: StringFilter<"EmailMessage"> | string
    to?: JsonFilter<"EmailMessage">
    subject?: StringFilter<"EmailMessage"> | string
    body?: StringFilter<"EmailMessage"> | string
    isProcessed?: BoolFilter<"EmailMessage"> | boolean
    extractedData?: JsonNullableFilter<"EmailMessage">
    attachments?: JsonNullableFilter<"EmailMessage">
    createdAt?: DateTimeFilter<"EmailMessage"> | Date | string
    receivedAt?: DateTimeFilter<"EmailMessage"> | Date | string
    thread?: XOR<EmailThreadRelationFilter, EmailThreadWhereInput>
  }

  export type EmailMessageOrderByWithRelationInput = {
    id?: SortOrder
    threadId?: SortOrder
    gmailMessageId?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    isProcessed?: SortOrder
    extractedData?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    receivedAt?: SortOrder
    thread?: EmailThreadOrderByWithRelationInput
  }

  export type EmailMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gmailMessageId?: string
    AND?: EmailMessageWhereInput | EmailMessageWhereInput[]
    OR?: EmailMessageWhereInput[]
    NOT?: EmailMessageWhereInput | EmailMessageWhereInput[]
    threadId?: StringFilter<"EmailMessage"> | string
    sender?: StringFilter<"EmailMessage"> | string
    to?: JsonFilter<"EmailMessage">
    subject?: StringFilter<"EmailMessage"> | string
    body?: StringFilter<"EmailMessage"> | string
    isProcessed?: BoolFilter<"EmailMessage"> | boolean
    extractedData?: JsonNullableFilter<"EmailMessage">
    attachments?: JsonNullableFilter<"EmailMessage">
    createdAt?: DateTimeFilter<"EmailMessage"> | Date | string
    receivedAt?: DateTimeFilter<"EmailMessage"> | Date | string
    thread?: XOR<EmailThreadRelationFilter, EmailThreadWhereInput>
  }, "id" | "gmailMessageId">

  export type EmailMessageOrderByWithAggregationInput = {
    id?: SortOrder
    threadId?: SortOrder
    gmailMessageId?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    isProcessed?: SortOrder
    extractedData?: SortOrderInput | SortOrder
    attachments?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    receivedAt?: SortOrder
    _count?: EmailMessageCountOrderByAggregateInput
    _max?: EmailMessageMaxOrderByAggregateInput
    _min?: EmailMessageMinOrderByAggregateInput
  }

  export type EmailMessageScalarWhereWithAggregatesInput = {
    AND?: EmailMessageScalarWhereWithAggregatesInput | EmailMessageScalarWhereWithAggregatesInput[]
    OR?: EmailMessageScalarWhereWithAggregatesInput[]
    NOT?: EmailMessageScalarWhereWithAggregatesInput | EmailMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailMessage"> | string
    threadId?: StringWithAggregatesFilter<"EmailMessage"> | string
    gmailMessageId?: StringWithAggregatesFilter<"EmailMessage"> | string
    sender?: StringWithAggregatesFilter<"EmailMessage"> | string
    to?: JsonWithAggregatesFilter<"EmailMessage">
    subject?: StringWithAggregatesFilter<"EmailMessage"> | string
    body?: StringWithAggregatesFilter<"EmailMessage"> | string
    isProcessed?: BoolWithAggregatesFilter<"EmailMessage"> | boolean
    extractedData?: JsonNullableWithAggregatesFilter<"EmailMessage">
    attachments?: JsonNullableWithAggregatesFilter<"EmailMessage">
    createdAt?: DateTimeWithAggregatesFilter<"EmailMessage"> | Date | string
    receivedAt?: DateTimeWithAggregatesFilter<"EmailMessage"> | Date | string
  }

  export type WorkflowExecutionWhereInput = {
    AND?: WorkflowExecutionWhereInput | WorkflowExecutionWhereInput[]
    OR?: WorkflowExecutionWhereInput[]
    NOT?: WorkflowExecutionWhereInput | WorkflowExecutionWhereInput[]
    id?: StringFilter<"WorkflowExecution"> | string
    orgId?: StringFilter<"WorkflowExecution"> | string
    workflowType?: StringFilter<"WorkflowExecution"> | string
    entityId?: StringFilter<"WorkflowExecution"> | string
    entityType?: StringFilter<"WorkflowExecution"> | string
    currentState?: StringFilter<"WorkflowExecution"> | string
    stateData?: JsonFilter<"WorkflowExecution">
    status?: EnumWorkflowStatusFilter<"WorkflowExecution"> | $Enums.WorkflowStatus
    startedAt?: DateTimeFilter<"WorkflowExecution"> | Date | string
    completedAt?: DateTimeNullableFilter<"WorkflowExecution"> | Date | string | null
    errorMessage?: StringNullableFilter<"WorkflowExecution"> | string | null
    checkpoints?: JsonNullableFilter<"WorkflowExecution">
  }

  export type WorkflowExecutionOrderByWithRelationInput = {
    id?: SortOrder
    orgId?: SortOrder
    workflowType?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    currentState?: SortOrder
    stateData?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    checkpoints?: SortOrderInput | SortOrder
  }

  export type WorkflowExecutionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkflowExecutionWhereInput | WorkflowExecutionWhereInput[]
    OR?: WorkflowExecutionWhereInput[]
    NOT?: WorkflowExecutionWhereInput | WorkflowExecutionWhereInput[]
    orgId?: StringFilter<"WorkflowExecution"> | string
    workflowType?: StringFilter<"WorkflowExecution"> | string
    entityId?: StringFilter<"WorkflowExecution"> | string
    entityType?: StringFilter<"WorkflowExecution"> | string
    currentState?: StringFilter<"WorkflowExecution"> | string
    stateData?: JsonFilter<"WorkflowExecution">
    status?: EnumWorkflowStatusFilter<"WorkflowExecution"> | $Enums.WorkflowStatus
    startedAt?: DateTimeFilter<"WorkflowExecution"> | Date | string
    completedAt?: DateTimeNullableFilter<"WorkflowExecution"> | Date | string | null
    errorMessage?: StringNullableFilter<"WorkflowExecution"> | string | null
    checkpoints?: JsonNullableFilter<"WorkflowExecution">
  }, "id">

  export type WorkflowExecutionOrderByWithAggregationInput = {
    id?: SortOrder
    orgId?: SortOrder
    workflowType?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    currentState?: SortOrder
    stateData?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    checkpoints?: SortOrderInput | SortOrder
    _count?: WorkflowExecutionCountOrderByAggregateInput
    _max?: WorkflowExecutionMaxOrderByAggregateInput
    _min?: WorkflowExecutionMinOrderByAggregateInput
  }

  export type WorkflowExecutionScalarWhereWithAggregatesInput = {
    AND?: WorkflowExecutionScalarWhereWithAggregatesInput | WorkflowExecutionScalarWhereWithAggregatesInput[]
    OR?: WorkflowExecutionScalarWhereWithAggregatesInput[]
    NOT?: WorkflowExecutionScalarWhereWithAggregatesInput | WorkflowExecutionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkflowExecution"> | string
    orgId?: StringWithAggregatesFilter<"WorkflowExecution"> | string
    workflowType?: StringWithAggregatesFilter<"WorkflowExecution"> | string
    entityId?: StringWithAggregatesFilter<"WorkflowExecution"> | string
    entityType?: StringWithAggregatesFilter<"WorkflowExecution"> | string
    currentState?: StringWithAggregatesFilter<"WorkflowExecution"> | string
    stateData?: JsonWithAggregatesFilter<"WorkflowExecution">
    status?: EnumWorkflowStatusWithAggregatesFilter<"WorkflowExecution"> | $Enums.WorkflowStatus
    startedAt?: DateTimeWithAggregatesFilter<"WorkflowExecution"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"WorkflowExecution"> | Date | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"WorkflowExecution"> | string | null
    checkpoints?: JsonNullableWithAggregatesFilter<"WorkflowExecution">
  }

  export type OrganizationCreateInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    vendors?: VendorCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteCreateNestedManyWithoutOrganizationInput
    payments?: PaymentCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    vendors?: VendorUncheckedCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteUncheckedCreateNestedManyWithoutOrganizationInput
    payments?: PaymentUncheckedCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUncheckedUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUncheckedUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutUsersInput
    createdRequests?: ProcurementRequestCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdRequests?: ProcurementRequestUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    createdRequests?: ProcurementRequestUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdRequests?: ProcurementRequestUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutVendorsInput
    quotes?: QuoteCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    quotes?: QuoteUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutVendorsNestedInput
    quotes?: QuoteUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotes?: QuoteUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorCreateManyInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcurementRequestCreateInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutRequestsInput
    creator: UserCreateNestedOneWithoutCreatedRequestsInput
    quotes?: QuoteCreateNestedManyWithoutRequestInput
    payments?: PaymentCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    quotes?: QuoteUncheckedCreateNestedManyWithoutRequestInput
    payments?: PaymentUncheckedCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutRequestsNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedRequestsNestedInput
    quotes?: QuoteUpdateManyWithoutRequestNestedInput
    payments?: PaymentUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    quotes?: QuoteUncheckedUpdateManyWithoutRequestNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type ProcurementRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProcurementRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuoteCreateInput = {
    id?: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutQuotesInput
    request: ProcurementRequestCreateNestedOneWithoutQuotesInput
    vendor: VendorCreateNestedOneWithoutQuotesInput
    payments?: PaymentCreateNestedManyWithoutQuoteInput
  }

  export type QuoteUncheckedCreateInput = {
    id?: string
    orgId: string
    requestId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutQuoteInput
  }

  export type QuoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutQuotesNestedInput
    request?: ProcurementRequestUpdateOneRequiredWithoutQuotesNestedInput
    vendor?: VendorUpdateOneRequiredWithoutQuotesNestedInput
    payments?: PaymentUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteCreateManyInput = {
    id?: string
    orgId: string
    requestId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutPaymentsInput
    request: ProcurementRequestCreateNestedOneWithoutPaymentsInput
    quote: QuoteCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    orgId: string
    requestId: string
    quoteId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutPaymentsNestedInput
    request?: ProcurementRequestUpdateOneRequiredWithoutPaymentsNestedInput
    quote?: QuoteUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    quoteId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentCreateManyInput = {
    id?: string
    orgId: string
    requestId: string
    quoteId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    quoteId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutAuditLogsInput
    user?: UserCreateNestedOneWithoutAuditLogsInput
    request?: ProcurementRequestCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    requestId?: string | null
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutAuditLogsNestedInput
    user?: UserUpdateOneWithoutAuditLogsNestedInput
    request?: ProcurementRequestUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogCreateManyInput = {
    id?: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    requestId?: string | null
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EmailThreadCreateInput = {
    id?: string
    orgId: string
    gmailThreadId: string
    subject: string
    participants: JsonNullValueInput | InputJsonValue
    requestId?: string | null
    lastMessageAt: Date | string
    messageCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: EmailMessageCreateNestedManyWithoutThreadInput
  }

  export type EmailThreadUncheckedCreateInput = {
    id?: string
    orgId: string
    gmailThreadId: string
    subject: string
    participants: JsonNullValueInput | InputJsonValue
    requestId?: string | null
    lastMessageAt: Date | string
    messageCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: EmailMessageUncheckedCreateNestedManyWithoutThreadInput
  }

  export type EmailThreadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    gmailThreadId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: EmailMessageUpdateManyWithoutThreadNestedInput
  }

  export type EmailThreadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    gmailThreadId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: EmailMessageUncheckedUpdateManyWithoutThreadNestedInput
  }

  export type EmailThreadCreateManyInput = {
    id?: string
    orgId: string
    gmailThreadId: string
    subject: string
    participants: JsonNullValueInput | InputJsonValue
    requestId?: string | null
    lastMessageAt: Date | string
    messageCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmailThreadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    gmailThreadId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailThreadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    gmailThreadId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailMessageCreateInput = {
    id?: string
    gmailMessageId: string
    sender: string
    to: JsonNullValueInput | InputJsonValue
    subject: string
    body: string
    isProcessed?: boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    receivedAt: Date | string
    thread: EmailThreadCreateNestedOneWithoutMessagesInput
  }

  export type EmailMessageUncheckedCreateInput = {
    id?: string
    threadId: string
    gmailMessageId: string
    sender: string
    to: JsonNullValueInput | InputJsonValue
    subject: string
    body: string
    isProcessed?: boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    receivedAt: Date | string
  }

  export type EmailMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    thread?: EmailThreadUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type EmailMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailMessageCreateManyInput = {
    id?: string
    threadId: string
    gmailMessageId: string
    sender: string
    to: JsonNullValueInput | InputJsonValue
    subject: string
    body: string
    isProcessed?: boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    receivedAt: Date | string
  }

  export type EmailMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    threadId?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowExecutionCreateInput = {
    id?: string
    orgId: string
    workflowType: string
    entityId: string
    entityType: string
    currentState: string
    stateData: JsonNullValueInput | InputJsonValue
    status?: $Enums.WorkflowStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WorkflowExecutionUncheckedCreateInput = {
    id?: string
    orgId: string
    workflowType: string
    entityId: string
    entityType: string
    currentState: string
    stateData: JsonNullValueInput | InputJsonValue
    status?: $Enums.WorkflowStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WorkflowExecutionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    workflowType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    currentState?: StringFieldUpdateOperationsInput | string
    stateData?: JsonNullValueInput | InputJsonValue
    status?: EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WorkflowExecutionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    workflowType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    currentState?: StringFieldUpdateOperationsInput | string
    stateData?: JsonNullValueInput | InputJsonValue
    status?: EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WorkflowExecutionCreateManyInput = {
    id?: string
    orgId: string
    workflowType: string
    entityId: string
    entityType: string
    currentState: string
    stateData: JsonNullValueInput | InputJsonValue
    status?: $Enums.WorkflowStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WorkflowExecutionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    workflowType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    currentState?: StringFieldUpdateOperationsInput | string
    stateData?: JsonNullValueInput | InputJsonValue
    status?: EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WorkflowExecutionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    workflowType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    currentState?: StringFieldUpdateOperationsInput | string
    stateData?: JsonNullValueInput | InputJsonValue
    status?: EnumWorkflowStatusFieldUpdateOperationsInput | $Enums.WorkflowStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoints?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type VendorListRelationFilter = {
    every?: VendorWhereInput
    some?: VendorWhereInput
    none?: VendorWhereInput
  }

  export type ProcurementRequestListRelationFilter = {
    every?: ProcurementRequestWhereInput
    some?: ProcurementRequestWhereInput
    none?: ProcurementRequestWhereInput
  }

  export type QuoteListRelationFilter = {
    every?: QuoteWhereInput
    some?: QuoteWhereInput
    none?: QuoteWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProcurementRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type OrganizationRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    orgId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    orgId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    website?: SortOrder
    address?: SortOrder
    orgId?: SortOrder
    metadata?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    website?: SortOrder
    orgId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    website?: SortOrder
    orgId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type EnumRequestPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestPriority | EnumRequestPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestPriorityFilter<$PrismaModel> | $Enums.RequestPriority
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ProcurementRequestCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    items?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    orgId?: SortOrder
    createdBy?: SortOrder
    approvedVendorId?: SortOrder
    approvedQuoteId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requestedBy?: SortOrder
    approvedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ProcurementRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    orgId?: SortOrder
    createdBy?: SortOrder
    approvedVendorId?: SortOrder
    approvedQuoteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requestedBy?: SortOrder
    approvedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ProcurementRequestMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    orgId?: SortOrder
    createdBy?: SortOrder
    approvedVendorId?: SortOrder
    approvedQuoteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requestedBy?: SortOrder
    approvedAt?: SortOrder
    completedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type EnumRequestPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestPriority | EnumRequestPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestPriorityWithAggregatesFilter<$PrismaModel> | $Enums.RequestPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestPriorityFilter<$PrismaModel>
    _max?: NestedEnumRequestPriorityFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumQuoteSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteSource | EnumQuoteSourceFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteSourceFilter<$PrismaModel> | $Enums.QuoteSource
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumQuoteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | EnumQuoteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteStatusFilter<$PrismaModel> | $Enums.QuoteStatus
  }

  export type ProcurementRequestRelationFilter = {
    is?: ProcurementRequestWhereInput
    isNot?: ProcurementRequestWhereInput
  }

  export type VendorRelationFilter = {
    is?: VendorWhereInput
    isNot?: VendorWhereInput
  }

  export type QuoteCountOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    vendorId?: SortOrder
    items?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    deliveryDays?: SortOrder
    validUntil?: SortOrder
    terms?: SortOrder
    source?: SortOrder
    rawData?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuoteAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
    deliveryDays?: SortOrder
    confidence?: SortOrder
  }

  export type QuoteMaxOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    vendorId?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    deliveryDays?: SortOrder
    validUntil?: SortOrder
    source?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuoteMinOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    vendorId?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    deliveryDays?: SortOrder
    validUntil?: SortOrder
    source?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuoteSumOrderByAggregateInput = {
    totalAmount?: SortOrder
    deliveryDays?: SortOrder
    confidence?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumQuoteSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteSource | EnumQuoteSourceFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteSourceWithAggregatesFilter<$PrismaModel> | $Enums.QuoteSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuoteSourceFilter<$PrismaModel>
    _max?: NestedEnumQuoteSourceFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumQuoteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | EnumQuoteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuoteStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuoteStatusFilter<$PrismaModel>
    _max?: NestedEnumQuoteStatusFilter<$PrismaModel>
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type QuoteRelationFilter = {
    is?: QuoteWhereInput
    isNot?: QuoteWhereInput
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    quoteId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    stripePaymentIntentId?: SortOrder
    stripeChargeId?: SortOrder
    method?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paidAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    quoteId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    stripePaymentIntentId?: SortOrder
    stripeChargeId?: SortOrder
    method?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paidAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    requestId?: SortOrder
    quoteId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    stripePaymentIntentId?: SortOrder
    stripeChargeId?: SortOrder
    method?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paidAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ProcurementRequestNullableRelationFilter = {
    is?: ProcurementRequestWhereInput | null
    isNot?: ProcurementRequestWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    oldValues?: SortOrder
    newValues?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    requestId?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    requestId?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    requestId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EmailMessageListRelationFilter = {
    every?: EmailMessageWhereInput
    some?: EmailMessageWhereInput
    none?: EmailMessageWhereInput
  }

  export type EmailMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmailThreadCountOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    gmailThreadId?: SortOrder
    subject?: SortOrder
    participants?: SortOrder
    requestId?: SortOrder
    lastMessageAt?: SortOrder
    messageCount?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmailThreadAvgOrderByAggregateInput = {
    messageCount?: SortOrder
  }

  export type EmailThreadMaxOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    gmailThreadId?: SortOrder
    subject?: SortOrder
    requestId?: SortOrder
    lastMessageAt?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmailThreadMinOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    gmailThreadId?: SortOrder
    subject?: SortOrder
    requestId?: SortOrder
    lastMessageAt?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmailThreadSumOrderByAggregateInput = {
    messageCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EmailThreadRelationFilter = {
    is?: EmailThreadWhereInput
    isNot?: EmailThreadWhereInput
  }

  export type EmailMessageCountOrderByAggregateInput = {
    id?: SortOrder
    threadId?: SortOrder
    gmailMessageId?: SortOrder
    sender?: SortOrder
    to?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    isProcessed?: SortOrder
    extractedData?: SortOrder
    attachments?: SortOrder
    createdAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type EmailMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    threadId?: SortOrder
    gmailMessageId?: SortOrder
    sender?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type EmailMessageMinOrderByAggregateInput = {
    id?: SortOrder
    threadId?: SortOrder
    gmailMessageId?: SortOrder
    sender?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type EnumWorkflowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkflowStatus | EnumWorkflowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWorkflowStatusFilter<$PrismaModel> | $Enums.WorkflowStatus
  }

  export type WorkflowExecutionCountOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    workflowType?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    currentState?: SortOrder
    stateData?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
    checkpoints?: SortOrder
  }

  export type WorkflowExecutionMaxOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    workflowType?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    currentState?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
  }

  export type WorkflowExecutionMinOrderByAggregateInput = {
    id?: SortOrder
    orgId?: SortOrder
    workflowType?: SortOrder
    entityId?: SortOrder
    entityType?: SortOrder
    currentState?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
  }

  export type EnumWorkflowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkflowStatus | EnumWorkflowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWorkflowStatusWithAggregatesFilter<$PrismaModel> | $Enums.WorkflowStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWorkflowStatusFilter<$PrismaModel>
    _max?: NestedEnumWorkflowStatusFilter<$PrismaModel>
  }

  export type UserCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VendorCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<VendorCreateWithoutOrganizationInput, VendorUncheckedCreateWithoutOrganizationInput> | VendorCreateWithoutOrganizationInput[] | VendorUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: VendorCreateOrConnectWithoutOrganizationInput | VendorCreateOrConnectWithoutOrganizationInput[]
    createMany?: VendorCreateManyOrganizationInputEnvelope
    connect?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
  }

  export type ProcurementRequestCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<ProcurementRequestCreateWithoutOrganizationInput, ProcurementRequestUncheckedCreateWithoutOrganizationInput> | ProcurementRequestCreateWithoutOrganizationInput[] | ProcurementRequestUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutOrganizationInput | ProcurementRequestCreateOrConnectWithoutOrganizationInput[]
    createMany?: ProcurementRequestCreateManyOrganizationInputEnvelope
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
  }

  export type QuoteCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<QuoteCreateWithoutOrganizationInput, QuoteUncheckedCreateWithoutOrganizationInput> | QuoteCreateWithoutOrganizationInput[] | QuoteUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutOrganizationInput | QuoteCreateOrConnectWithoutOrganizationInput[]
    createMany?: QuoteCreateManyOrganizationInputEnvelope
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<PaymentCreateWithoutOrganizationInput, PaymentUncheckedCreateWithoutOrganizationInput> | PaymentCreateWithoutOrganizationInput[] | PaymentUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrganizationInput | PaymentCreateOrConnectWithoutOrganizationInput[]
    createMany?: PaymentCreateManyOrganizationInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VendorUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<VendorCreateWithoutOrganizationInput, VendorUncheckedCreateWithoutOrganizationInput> | VendorCreateWithoutOrganizationInput[] | VendorUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: VendorCreateOrConnectWithoutOrganizationInput | VendorCreateOrConnectWithoutOrganizationInput[]
    createMany?: VendorCreateManyOrganizationInputEnvelope
    connect?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
  }

  export type ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<ProcurementRequestCreateWithoutOrganizationInput, ProcurementRequestUncheckedCreateWithoutOrganizationInput> | ProcurementRequestCreateWithoutOrganizationInput[] | ProcurementRequestUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutOrganizationInput | ProcurementRequestCreateOrConnectWithoutOrganizationInput[]
    createMany?: ProcurementRequestCreateManyOrganizationInputEnvelope
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
  }

  export type QuoteUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<QuoteCreateWithoutOrganizationInput, QuoteUncheckedCreateWithoutOrganizationInput> | QuoteCreateWithoutOrganizationInput[] | QuoteUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutOrganizationInput | QuoteCreateOrConnectWithoutOrganizationInput[]
    createMany?: QuoteCreateManyOrganizationInputEnvelope
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<PaymentCreateWithoutOrganizationInput, PaymentUncheckedCreateWithoutOrganizationInput> | PaymentCreateWithoutOrganizationInput[] | PaymentUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrganizationInput | PaymentCreateOrConnectWithoutOrganizationInput[]
    createMany?: PaymentCreateManyOrganizationInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VendorUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<VendorCreateWithoutOrganizationInput, VendorUncheckedCreateWithoutOrganizationInput> | VendorCreateWithoutOrganizationInput[] | VendorUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: VendorCreateOrConnectWithoutOrganizationInput | VendorCreateOrConnectWithoutOrganizationInput[]
    upsert?: VendorUpsertWithWhereUniqueWithoutOrganizationInput | VendorUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: VendorCreateManyOrganizationInputEnvelope
    set?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    disconnect?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    delete?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    connect?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    update?: VendorUpdateWithWhereUniqueWithoutOrganizationInput | VendorUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: VendorUpdateManyWithWhereWithoutOrganizationInput | VendorUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: VendorScalarWhereInput | VendorScalarWhereInput[]
  }

  export type ProcurementRequestUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutOrganizationInput, ProcurementRequestUncheckedCreateWithoutOrganizationInput> | ProcurementRequestCreateWithoutOrganizationInput[] | ProcurementRequestUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutOrganizationInput | ProcurementRequestCreateOrConnectWithoutOrganizationInput[]
    upsert?: ProcurementRequestUpsertWithWhereUniqueWithoutOrganizationInput | ProcurementRequestUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: ProcurementRequestCreateManyOrganizationInputEnvelope
    set?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    disconnect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    delete?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    update?: ProcurementRequestUpdateWithWhereUniqueWithoutOrganizationInput | ProcurementRequestUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: ProcurementRequestUpdateManyWithWhereWithoutOrganizationInput | ProcurementRequestUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: ProcurementRequestScalarWhereInput | ProcurementRequestScalarWhereInput[]
  }

  export type QuoteUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<QuoteCreateWithoutOrganizationInput, QuoteUncheckedCreateWithoutOrganizationInput> | QuoteCreateWithoutOrganizationInput[] | QuoteUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutOrganizationInput | QuoteCreateOrConnectWithoutOrganizationInput[]
    upsert?: QuoteUpsertWithWhereUniqueWithoutOrganizationInput | QuoteUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: QuoteCreateManyOrganizationInputEnvelope
    set?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    disconnect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    delete?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    update?: QuoteUpdateWithWhereUniqueWithoutOrganizationInput | QuoteUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: QuoteUpdateManyWithWhereWithoutOrganizationInput | QuoteUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<PaymentCreateWithoutOrganizationInput, PaymentUncheckedCreateWithoutOrganizationInput> | PaymentCreateWithoutOrganizationInput[] | PaymentUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrganizationInput | PaymentCreateOrConnectWithoutOrganizationInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutOrganizationInput | PaymentUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: PaymentCreateManyOrganizationInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutOrganizationInput | PaymentUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutOrganizationInput | PaymentUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutOrganizationInput | AuditLogUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutOrganizationInput | AuditLogUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutOrganizationInput | AuditLogUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VendorUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<VendorCreateWithoutOrganizationInput, VendorUncheckedCreateWithoutOrganizationInput> | VendorCreateWithoutOrganizationInput[] | VendorUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: VendorCreateOrConnectWithoutOrganizationInput | VendorCreateOrConnectWithoutOrganizationInput[]
    upsert?: VendorUpsertWithWhereUniqueWithoutOrganizationInput | VendorUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: VendorCreateManyOrganizationInputEnvelope
    set?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    disconnect?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    delete?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    connect?: VendorWhereUniqueInput | VendorWhereUniqueInput[]
    update?: VendorUpdateWithWhereUniqueWithoutOrganizationInput | VendorUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: VendorUpdateManyWithWhereWithoutOrganizationInput | VendorUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: VendorScalarWhereInput | VendorScalarWhereInput[]
  }

  export type ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutOrganizationInput, ProcurementRequestUncheckedCreateWithoutOrganizationInput> | ProcurementRequestCreateWithoutOrganizationInput[] | ProcurementRequestUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutOrganizationInput | ProcurementRequestCreateOrConnectWithoutOrganizationInput[]
    upsert?: ProcurementRequestUpsertWithWhereUniqueWithoutOrganizationInput | ProcurementRequestUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: ProcurementRequestCreateManyOrganizationInputEnvelope
    set?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    disconnect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    delete?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    update?: ProcurementRequestUpdateWithWhereUniqueWithoutOrganizationInput | ProcurementRequestUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: ProcurementRequestUpdateManyWithWhereWithoutOrganizationInput | ProcurementRequestUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: ProcurementRequestScalarWhereInput | ProcurementRequestScalarWhereInput[]
  }

  export type QuoteUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<QuoteCreateWithoutOrganizationInput, QuoteUncheckedCreateWithoutOrganizationInput> | QuoteCreateWithoutOrganizationInput[] | QuoteUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutOrganizationInput | QuoteCreateOrConnectWithoutOrganizationInput[]
    upsert?: QuoteUpsertWithWhereUniqueWithoutOrganizationInput | QuoteUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: QuoteCreateManyOrganizationInputEnvelope
    set?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    disconnect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    delete?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    update?: QuoteUpdateWithWhereUniqueWithoutOrganizationInput | QuoteUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: QuoteUpdateManyWithWhereWithoutOrganizationInput | QuoteUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<PaymentCreateWithoutOrganizationInput, PaymentUncheckedCreateWithoutOrganizationInput> | PaymentCreateWithoutOrganizationInput[] | PaymentUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrganizationInput | PaymentCreateOrConnectWithoutOrganizationInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutOrganizationInput | PaymentUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: PaymentCreateManyOrganizationInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutOrganizationInput | PaymentUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutOrganizationInput | PaymentUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutOrganizationInput | AuditLogUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutOrganizationInput | AuditLogUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutOrganizationInput | AuditLogUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type ProcurementRequestCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ProcurementRequestCreateWithoutCreatorInput, ProcurementRequestUncheckedCreateWithoutCreatorInput> | ProcurementRequestCreateWithoutCreatorInput[] | ProcurementRequestUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutCreatorInput | ProcurementRequestCreateOrConnectWithoutCreatorInput[]
    createMany?: ProcurementRequestCreateManyCreatorInputEnvelope
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type ProcurementRequestUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ProcurementRequestCreateWithoutCreatorInput, ProcurementRequestUncheckedCreateWithoutCreatorInput> | ProcurementRequestCreateWithoutCreatorInput[] | ProcurementRequestUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutCreatorInput | ProcurementRequestCreateOrConnectWithoutCreatorInput[]
    createMany?: ProcurementRequestCreateManyCreatorInputEnvelope
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type OrganizationUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    upsert?: OrganizationUpsertWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutUsersInput, OrganizationUpdateWithoutUsersInput>, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type ProcurementRequestUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutCreatorInput, ProcurementRequestUncheckedCreateWithoutCreatorInput> | ProcurementRequestCreateWithoutCreatorInput[] | ProcurementRequestUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutCreatorInput | ProcurementRequestCreateOrConnectWithoutCreatorInput[]
    upsert?: ProcurementRequestUpsertWithWhereUniqueWithoutCreatorInput | ProcurementRequestUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ProcurementRequestCreateManyCreatorInputEnvelope
    set?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    disconnect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    delete?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    update?: ProcurementRequestUpdateWithWhereUniqueWithoutCreatorInput | ProcurementRequestUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ProcurementRequestUpdateManyWithWhereWithoutCreatorInput | ProcurementRequestUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ProcurementRequestScalarWhereInput | ProcurementRequestScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type ProcurementRequestUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutCreatorInput, ProcurementRequestUncheckedCreateWithoutCreatorInput> | ProcurementRequestCreateWithoutCreatorInput[] | ProcurementRequestUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutCreatorInput | ProcurementRequestCreateOrConnectWithoutCreatorInput[]
    upsert?: ProcurementRequestUpsertWithWhereUniqueWithoutCreatorInput | ProcurementRequestUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ProcurementRequestCreateManyCreatorInputEnvelope
    set?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    disconnect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    delete?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    connect?: ProcurementRequestWhereUniqueInput | ProcurementRequestWhereUniqueInput[]
    update?: ProcurementRequestUpdateWithWhereUniqueWithoutCreatorInput | ProcurementRequestUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ProcurementRequestUpdateManyWithWhereWithoutCreatorInput | ProcurementRequestUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ProcurementRequestScalarWhereInput | ProcurementRequestScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutVendorsInput = {
    create?: XOR<OrganizationCreateWithoutVendorsInput, OrganizationUncheckedCreateWithoutVendorsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutVendorsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type QuoteCreateNestedManyWithoutVendorInput = {
    create?: XOR<QuoteCreateWithoutVendorInput, QuoteUncheckedCreateWithoutVendorInput> | QuoteCreateWithoutVendorInput[] | QuoteUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutVendorInput | QuoteCreateOrConnectWithoutVendorInput[]
    createMany?: QuoteCreateManyVendorInputEnvelope
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
  }

  export type QuoteUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<QuoteCreateWithoutVendorInput, QuoteUncheckedCreateWithoutVendorInput> | QuoteCreateWithoutVendorInput[] | QuoteUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutVendorInput | QuoteCreateOrConnectWithoutVendorInput[]
    createMany?: QuoteCreateManyVendorInputEnvelope
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutVendorsNestedInput = {
    create?: XOR<OrganizationCreateWithoutVendorsInput, OrganizationUncheckedCreateWithoutVendorsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutVendorsInput
    upsert?: OrganizationUpsertWithoutVendorsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutVendorsInput, OrganizationUpdateWithoutVendorsInput>, OrganizationUncheckedUpdateWithoutVendorsInput>
  }

  export type QuoteUpdateManyWithoutVendorNestedInput = {
    create?: XOR<QuoteCreateWithoutVendorInput, QuoteUncheckedCreateWithoutVendorInput> | QuoteCreateWithoutVendorInput[] | QuoteUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutVendorInput | QuoteCreateOrConnectWithoutVendorInput[]
    upsert?: QuoteUpsertWithWhereUniqueWithoutVendorInput | QuoteUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: QuoteCreateManyVendorInputEnvelope
    set?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    disconnect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    delete?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    update?: QuoteUpdateWithWhereUniqueWithoutVendorInput | QuoteUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: QuoteUpdateManyWithWhereWithoutVendorInput | QuoteUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
  }

  export type QuoteUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<QuoteCreateWithoutVendorInput, QuoteUncheckedCreateWithoutVendorInput> | QuoteCreateWithoutVendorInput[] | QuoteUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutVendorInput | QuoteCreateOrConnectWithoutVendorInput[]
    upsert?: QuoteUpsertWithWhereUniqueWithoutVendorInput | QuoteUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: QuoteCreateManyVendorInputEnvelope
    set?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    disconnect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    delete?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    update?: QuoteUpdateWithWhereUniqueWithoutVendorInput | QuoteUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: QuoteUpdateManyWithWhereWithoutVendorInput | QuoteUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutRequestsInput = {
    create?: XOR<OrganizationCreateWithoutRequestsInput, OrganizationUncheckedCreateWithoutRequestsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutRequestsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatedRequestsInput = {
    create?: XOR<UserCreateWithoutCreatedRequestsInput, UserUncheckedCreateWithoutCreatedRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type QuoteCreateNestedManyWithoutRequestInput = {
    create?: XOR<QuoteCreateWithoutRequestInput, QuoteUncheckedCreateWithoutRequestInput> | QuoteCreateWithoutRequestInput[] | QuoteUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutRequestInput | QuoteCreateOrConnectWithoutRequestInput[]
    createMany?: QuoteCreateManyRequestInputEnvelope
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutRequestInput = {
    create?: XOR<PaymentCreateWithoutRequestInput, PaymentUncheckedCreateWithoutRequestInput> | PaymentCreateWithoutRequestInput[] | PaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutRequestInput | PaymentCreateOrConnectWithoutRequestInput[]
    createMany?: PaymentCreateManyRequestInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutRequestInput = {
    create?: XOR<AuditLogCreateWithoutRequestInput, AuditLogUncheckedCreateWithoutRequestInput> | AuditLogCreateWithoutRequestInput[] | AuditLogUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutRequestInput | AuditLogCreateOrConnectWithoutRequestInput[]
    createMany?: AuditLogCreateManyRequestInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type QuoteUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<QuoteCreateWithoutRequestInput, QuoteUncheckedCreateWithoutRequestInput> | QuoteCreateWithoutRequestInput[] | QuoteUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutRequestInput | QuoteCreateOrConnectWithoutRequestInput[]
    createMany?: QuoteCreateManyRequestInputEnvelope
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<PaymentCreateWithoutRequestInput, PaymentUncheckedCreateWithoutRequestInput> | PaymentCreateWithoutRequestInput[] | PaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutRequestInput | PaymentCreateOrConnectWithoutRequestInput[]
    createMany?: PaymentCreateManyRequestInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<AuditLogCreateWithoutRequestInput, AuditLogUncheckedCreateWithoutRequestInput> | AuditLogCreateWithoutRequestInput[] | AuditLogUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutRequestInput | AuditLogCreateOrConnectWithoutRequestInput[]
    createMany?: AuditLogCreateManyRequestInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type EnumRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.RequestStatus
  }

  export type EnumRequestPriorityFieldUpdateOperationsInput = {
    set?: $Enums.RequestPriority
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type OrganizationUpdateOneRequiredWithoutRequestsNestedInput = {
    create?: XOR<OrganizationCreateWithoutRequestsInput, OrganizationUncheckedCreateWithoutRequestsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutRequestsInput
    upsert?: OrganizationUpsertWithoutRequestsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutRequestsInput, OrganizationUpdateWithoutRequestsInput>, OrganizationUncheckedUpdateWithoutRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutCreatedRequestsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedRequestsInput, UserUncheckedCreateWithoutCreatedRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedRequestsInput
    upsert?: UserUpsertWithoutCreatedRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedRequestsInput, UserUpdateWithoutCreatedRequestsInput>, UserUncheckedUpdateWithoutCreatedRequestsInput>
  }

  export type QuoteUpdateManyWithoutRequestNestedInput = {
    create?: XOR<QuoteCreateWithoutRequestInput, QuoteUncheckedCreateWithoutRequestInput> | QuoteCreateWithoutRequestInput[] | QuoteUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutRequestInput | QuoteCreateOrConnectWithoutRequestInput[]
    upsert?: QuoteUpsertWithWhereUniqueWithoutRequestInput | QuoteUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: QuoteCreateManyRequestInputEnvelope
    set?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    disconnect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    delete?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    update?: QuoteUpdateWithWhereUniqueWithoutRequestInput | QuoteUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: QuoteUpdateManyWithWhereWithoutRequestInput | QuoteUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutRequestNestedInput = {
    create?: XOR<PaymentCreateWithoutRequestInput, PaymentUncheckedCreateWithoutRequestInput> | PaymentCreateWithoutRequestInput[] | PaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutRequestInput | PaymentCreateOrConnectWithoutRequestInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutRequestInput | PaymentUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: PaymentCreateManyRequestInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutRequestInput | PaymentUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutRequestInput | PaymentUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutRequestNestedInput = {
    create?: XOR<AuditLogCreateWithoutRequestInput, AuditLogUncheckedCreateWithoutRequestInput> | AuditLogCreateWithoutRequestInput[] | AuditLogUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutRequestInput | AuditLogCreateOrConnectWithoutRequestInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutRequestInput | AuditLogUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: AuditLogCreateManyRequestInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutRequestInput | AuditLogUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutRequestInput | AuditLogUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type QuoteUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<QuoteCreateWithoutRequestInput, QuoteUncheckedCreateWithoutRequestInput> | QuoteCreateWithoutRequestInput[] | QuoteUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: QuoteCreateOrConnectWithoutRequestInput | QuoteCreateOrConnectWithoutRequestInput[]
    upsert?: QuoteUpsertWithWhereUniqueWithoutRequestInput | QuoteUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: QuoteCreateManyRequestInputEnvelope
    set?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    disconnect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    delete?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    connect?: QuoteWhereUniqueInput | QuoteWhereUniqueInput[]
    update?: QuoteUpdateWithWhereUniqueWithoutRequestInput | QuoteUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: QuoteUpdateManyWithWhereWithoutRequestInput | QuoteUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<PaymentCreateWithoutRequestInput, PaymentUncheckedCreateWithoutRequestInput> | PaymentCreateWithoutRequestInput[] | PaymentUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutRequestInput | PaymentCreateOrConnectWithoutRequestInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutRequestInput | PaymentUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: PaymentCreateManyRequestInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutRequestInput | PaymentUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutRequestInput | PaymentUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<AuditLogCreateWithoutRequestInput, AuditLogUncheckedCreateWithoutRequestInput> | AuditLogCreateWithoutRequestInput[] | AuditLogUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutRequestInput | AuditLogCreateOrConnectWithoutRequestInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutRequestInput | AuditLogUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: AuditLogCreateManyRequestInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutRequestInput | AuditLogUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutRequestInput | AuditLogUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutQuotesInput = {
    create?: XOR<OrganizationCreateWithoutQuotesInput, OrganizationUncheckedCreateWithoutQuotesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutQuotesInput
    connect?: OrganizationWhereUniqueInput
  }

  export type ProcurementRequestCreateNestedOneWithoutQuotesInput = {
    create?: XOR<ProcurementRequestCreateWithoutQuotesInput, ProcurementRequestUncheckedCreateWithoutQuotesInput>
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutQuotesInput
    connect?: ProcurementRequestWhereUniqueInput
  }

  export type VendorCreateNestedOneWithoutQuotesInput = {
    create?: XOR<VendorCreateWithoutQuotesInput, VendorUncheckedCreateWithoutQuotesInput>
    connectOrCreate?: VendorCreateOrConnectWithoutQuotesInput
    connect?: VendorWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutQuoteInput = {
    create?: XOR<PaymentCreateWithoutQuoteInput, PaymentUncheckedCreateWithoutQuoteInput> | PaymentCreateWithoutQuoteInput[] | PaymentUncheckedCreateWithoutQuoteInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuoteInput | PaymentCreateOrConnectWithoutQuoteInput[]
    createMany?: PaymentCreateManyQuoteInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutQuoteInput = {
    create?: XOR<PaymentCreateWithoutQuoteInput, PaymentUncheckedCreateWithoutQuoteInput> | PaymentCreateWithoutQuoteInput[] | PaymentUncheckedCreateWithoutQuoteInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuoteInput | PaymentCreateOrConnectWithoutQuoteInput[]
    createMany?: PaymentCreateManyQuoteInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumQuoteSourceFieldUpdateOperationsInput = {
    set?: $Enums.QuoteSource
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumQuoteStatusFieldUpdateOperationsInput = {
    set?: $Enums.QuoteStatus
  }

  export type OrganizationUpdateOneRequiredWithoutQuotesNestedInput = {
    create?: XOR<OrganizationCreateWithoutQuotesInput, OrganizationUncheckedCreateWithoutQuotesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutQuotesInput
    upsert?: OrganizationUpsertWithoutQuotesInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutQuotesInput, OrganizationUpdateWithoutQuotesInput>, OrganizationUncheckedUpdateWithoutQuotesInput>
  }

  export type ProcurementRequestUpdateOneRequiredWithoutQuotesNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutQuotesInput, ProcurementRequestUncheckedCreateWithoutQuotesInput>
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutQuotesInput
    upsert?: ProcurementRequestUpsertWithoutQuotesInput
    connect?: ProcurementRequestWhereUniqueInput
    update?: XOR<XOR<ProcurementRequestUpdateToOneWithWhereWithoutQuotesInput, ProcurementRequestUpdateWithoutQuotesInput>, ProcurementRequestUncheckedUpdateWithoutQuotesInput>
  }

  export type VendorUpdateOneRequiredWithoutQuotesNestedInput = {
    create?: XOR<VendorCreateWithoutQuotesInput, VendorUncheckedCreateWithoutQuotesInput>
    connectOrCreate?: VendorCreateOrConnectWithoutQuotesInput
    upsert?: VendorUpsertWithoutQuotesInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutQuotesInput, VendorUpdateWithoutQuotesInput>, VendorUncheckedUpdateWithoutQuotesInput>
  }

  export type PaymentUpdateManyWithoutQuoteNestedInput = {
    create?: XOR<PaymentCreateWithoutQuoteInput, PaymentUncheckedCreateWithoutQuoteInput> | PaymentCreateWithoutQuoteInput[] | PaymentUncheckedCreateWithoutQuoteInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuoteInput | PaymentCreateOrConnectWithoutQuoteInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutQuoteInput | PaymentUpsertWithWhereUniqueWithoutQuoteInput[]
    createMany?: PaymentCreateManyQuoteInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutQuoteInput | PaymentUpdateWithWhereUniqueWithoutQuoteInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutQuoteInput | PaymentUpdateManyWithWhereWithoutQuoteInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutQuoteNestedInput = {
    create?: XOR<PaymentCreateWithoutQuoteInput, PaymentUncheckedCreateWithoutQuoteInput> | PaymentCreateWithoutQuoteInput[] | PaymentUncheckedCreateWithoutQuoteInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuoteInput | PaymentCreateOrConnectWithoutQuoteInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutQuoteInput | PaymentUpsertWithWhereUniqueWithoutQuoteInput[]
    createMany?: PaymentCreateManyQuoteInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutQuoteInput | PaymentUpdateWithWhereUniqueWithoutQuoteInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutQuoteInput | PaymentUpdateManyWithWhereWithoutQuoteInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<OrganizationCreateWithoutPaymentsInput, OrganizationUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutPaymentsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type ProcurementRequestCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<ProcurementRequestCreateWithoutPaymentsInput, ProcurementRequestUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutPaymentsInput
    connect?: ProcurementRequestWhereUniqueInput
  }

  export type QuoteCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<QuoteCreateWithoutPaymentsInput, QuoteUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: QuoteCreateOrConnectWithoutPaymentsInput
    connect?: QuoteWhereUniqueInput
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type OrganizationUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<OrganizationCreateWithoutPaymentsInput, OrganizationUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutPaymentsInput
    upsert?: OrganizationUpsertWithoutPaymentsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutPaymentsInput, OrganizationUpdateWithoutPaymentsInput>, OrganizationUncheckedUpdateWithoutPaymentsInput>
  }

  export type ProcurementRequestUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutPaymentsInput, ProcurementRequestUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutPaymentsInput
    upsert?: ProcurementRequestUpsertWithoutPaymentsInput
    connect?: ProcurementRequestWhereUniqueInput
    update?: XOR<XOR<ProcurementRequestUpdateToOneWithWhereWithoutPaymentsInput, ProcurementRequestUpdateWithoutPaymentsInput>, ProcurementRequestUncheckedUpdateWithoutPaymentsInput>
  }

  export type QuoteUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<QuoteCreateWithoutPaymentsInput, QuoteUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: QuoteCreateOrConnectWithoutPaymentsInput
    upsert?: QuoteUpsertWithoutPaymentsInput
    connect?: QuoteWhereUniqueInput
    update?: XOR<XOR<QuoteUpdateToOneWithWhereWithoutPaymentsInput, QuoteUpdateWithoutPaymentsInput>, QuoteUncheckedUpdateWithoutPaymentsInput>
  }

  export type OrganizationCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<OrganizationCreateWithoutAuditLogsInput, OrganizationUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutAuditLogsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type ProcurementRequestCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<ProcurementRequestCreateWithoutAuditLogsInput, ProcurementRequestUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutAuditLogsInput
    connect?: ProcurementRequestWhereUniqueInput
  }

  export type OrganizationUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<OrganizationCreateWithoutAuditLogsInput, OrganizationUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutAuditLogsInput
    upsert?: OrganizationUpsertWithoutAuditLogsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutAuditLogsInput, OrganizationUpdateWithoutAuditLogsInput>, OrganizationUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ProcurementRequestUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<ProcurementRequestCreateWithoutAuditLogsInput, ProcurementRequestUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ProcurementRequestCreateOrConnectWithoutAuditLogsInput
    upsert?: ProcurementRequestUpsertWithoutAuditLogsInput
    disconnect?: ProcurementRequestWhereInput | boolean
    delete?: ProcurementRequestWhereInput | boolean
    connect?: ProcurementRequestWhereUniqueInput
    update?: XOR<XOR<ProcurementRequestUpdateToOneWithWhereWithoutAuditLogsInput, ProcurementRequestUpdateWithoutAuditLogsInput>, ProcurementRequestUncheckedUpdateWithoutAuditLogsInput>
  }

  export type EmailMessageCreateNestedManyWithoutThreadInput = {
    create?: XOR<EmailMessageCreateWithoutThreadInput, EmailMessageUncheckedCreateWithoutThreadInput> | EmailMessageCreateWithoutThreadInput[] | EmailMessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: EmailMessageCreateOrConnectWithoutThreadInput | EmailMessageCreateOrConnectWithoutThreadInput[]
    createMany?: EmailMessageCreateManyThreadInputEnvelope
    connect?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
  }

  export type EmailMessageUncheckedCreateNestedManyWithoutThreadInput = {
    create?: XOR<EmailMessageCreateWithoutThreadInput, EmailMessageUncheckedCreateWithoutThreadInput> | EmailMessageCreateWithoutThreadInput[] | EmailMessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: EmailMessageCreateOrConnectWithoutThreadInput | EmailMessageCreateOrConnectWithoutThreadInput[]
    createMany?: EmailMessageCreateManyThreadInputEnvelope
    connect?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EmailMessageUpdateManyWithoutThreadNestedInput = {
    create?: XOR<EmailMessageCreateWithoutThreadInput, EmailMessageUncheckedCreateWithoutThreadInput> | EmailMessageCreateWithoutThreadInput[] | EmailMessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: EmailMessageCreateOrConnectWithoutThreadInput | EmailMessageCreateOrConnectWithoutThreadInput[]
    upsert?: EmailMessageUpsertWithWhereUniqueWithoutThreadInput | EmailMessageUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: EmailMessageCreateManyThreadInputEnvelope
    set?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    disconnect?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    delete?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    connect?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    update?: EmailMessageUpdateWithWhereUniqueWithoutThreadInput | EmailMessageUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: EmailMessageUpdateManyWithWhereWithoutThreadInput | EmailMessageUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: EmailMessageScalarWhereInput | EmailMessageScalarWhereInput[]
  }

  export type EmailMessageUncheckedUpdateManyWithoutThreadNestedInput = {
    create?: XOR<EmailMessageCreateWithoutThreadInput, EmailMessageUncheckedCreateWithoutThreadInput> | EmailMessageCreateWithoutThreadInput[] | EmailMessageUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: EmailMessageCreateOrConnectWithoutThreadInput | EmailMessageCreateOrConnectWithoutThreadInput[]
    upsert?: EmailMessageUpsertWithWhereUniqueWithoutThreadInput | EmailMessageUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: EmailMessageCreateManyThreadInputEnvelope
    set?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    disconnect?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    delete?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    connect?: EmailMessageWhereUniqueInput | EmailMessageWhereUniqueInput[]
    update?: EmailMessageUpdateWithWhereUniqueWithoutThreadInput | EmailMessageUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: EmailMessageUpdateManyWithWhereWithoutThreadInput | EmailMessageUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: EmailMessageScalarWhereInput | EmailMessageScalarWhereInput[]
  }

  export type EmailThreadCreateNestedOneWithoutMessagesInput = {
    create?: XOR<EmailThreadCreateWithoutMessagesInput, EmailThreadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: EmailThreadCreateOrConnectWithoutMessagesInput
    connect?: EmailThreadWhereUniqueInput
  }

  export type EmailThreadUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<EmailThreadCreateWithoutMessagesInput, EmailThreadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: EmailThreadCreateOrConnectWithoutMessagesInput
    upsert?: EmailThreadUpsertWithoutMessagesInput
    connect?: EmailThreadWhereUniqueInput
    update?: XOR<XOR<EmailThreadUpdateToOneWithWhereWithoutMessagesInput, EmailThreadUpdateWithoutMessagesInput>, EmailThreadUncheckedUpdateWithoutMessagesInput>
  }

  export type EnumWorkflowStatusFieldUpdateOperationsInput = {
    set?: $Enums.WorkflowStatus
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type NestedEnumRequestPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestPriority | EnumRequestPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestPriorityFilter<$PrismaModel> | $Enums.RequestPriority
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumRequestPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestPriority | EnumRequestPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestPriority[] | ListEnumRequestPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestPriorityWithAggregatesFilter<$PrismaModel> | $Enums.RequestPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestPriorityFilter<$PrismaModel>
    _max?: NestedEnumRequestPriorityFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumQuoteSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteSource | EnumQuoteSourceFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteSourceFilter<$PrismaModel> | $Enums.QuoteSource
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumQuoteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | EnumQuoteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteStatusFilter<$PrismaModel> | $Enums.QuoteStatus
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedEnumQuoteSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteSource | EnumQuoteSourceFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteSource[] | ListEnumQuoteSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteSourceWithAggregatesFilter<$PrismaModel> | $Enums.QuoteSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuoteSourceFilter<$PrismaModel>
    _max?: NestedEnumQuoteSourceFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumQuoteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | EnumQuoteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuoteStatus[] | ListEnumQuoteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuoteStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuoteStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuoteStatusFilter<$PrismaModel>
    _max?: NestedEnumQuoteStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumWorkflowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkflowStatus | EnumWorkflowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWorkflowStatusFilter<$PrismaModel> | $Enums.WorkflowStatus
  }

  export type NestedEnumWorkflowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkflowStatus | EnumWorkflowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WorkflowStatus[] | ListEnumWorkflowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWorkflowStatusWithAggregatesFilter<$PrismaModel> | $Enums.WorkflowStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWorkflowStatusFilter<$PrismaModel>
    _max?: NestedEnumWorkflowStatusFilter<$PrismaModel>
  }

  export type UserCreateWithoutOrganizationInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdRequests?: ProcurementRequestCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrganizationInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdRequests?: ProcurementRequestUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserCreateManyOrganizationInputEnvelope = {
    data: UserCreateManyOrganizationInput | UserCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type VendorCreateWithoutOrganizationInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    quotes?: QuoteCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateWithoutOrganizationInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    quotes?: QuoteUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorCreateOrConnectWithoutOrganizationInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutOrganizationInput, VendorUncheckedCreateWithoutOrganizationInput>
  }

  export type VendorCreateManyOrganizationInputEnvelope = {
    data: VendorCreateManyOrganizationInput | VendorCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type ProcurementRequestCreateWithoutOrganizationInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    creator: UserCreateNestedOneWithoutCreatedRequestsInput
    quotes?: QuoteCreateNestedManyWithoutRequestInput
    payments?: PaymentCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUncheckedCreateWithoutOrganizationInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    quotes?: QuoteUncheckedCreateNestedManyWithoutRequestInput
    payments?: PaymentUncheckedCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestCreateOrConnectWithoutOrganizationInput = {
    where: ProcurementRequestWhereUniqueInput
    create: XOR<ProcurementRequestCreateWithoutOrganizationInput, ProcurementRequestUncheckedCreateWithoutOrganizationInput>
  }

  export type ProcurementRequestCreateManyOrganizationInputEnvelope = {
    data: ProcurementRequestCreateManyOrganizationInput | ProcurementRequestCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type QuoteCreateWithoutOrganizationInput = {
    id?: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    request: ProcurementRequestCreateNestedOneWithoutQuotesInput
    vendor: VendorCreateNestedOneWithoutQuotesInput
    payments?: PaymentCreateNestedManyWithoutQuoteInput
  }

  export type QuoteUncheckedCreateWithoutOrganizationInput = {
    id?: string
    requestId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutQuoteInput
  }

  export type QuoteCreateOrConnectWithoutOrganizationInput = {
    where: QuoteWhereUniqueInput
    create: XOR<QuoteCreateWithoutOrganizationInput, QuoteUncheckedCreateWithoutOrganizationInput>
  }

  export type QuoteCreateManyOrganizationInputEnvelope = {
    data: QuoteCreateManyOrganizationInput | QuoteCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutOrganizationInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
    request: ProcurementRequestCreateNestedOneWithoutPaymentsInput
    quote: QuoteCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutOrganizationInput = {
    id?: string
    requestId: string
    quoteId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type PaymentCreateOrConnectWithoutOrganizationInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutOrganizationInput, PaymentUncheckedCreateWithoutOrganizationInput>
  }

  export type PaymentCreateManyOrganizationInputEnvelope = {
    data: PaymentCreateManyOrganizationInput | PaymentCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutOrganizationInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
    request?: ProcurementRequestCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutOrganizationInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    requestId?: string | null
  }

  export type AuditLogCreateOrConnectWithoutOrganizationInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput>
  }

  export type AuditLogCreateManyOrganizationInputEnvelope = {
    data: AuditLogCreateManyOrganizationInput | AuditLogCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUpdateManyWithWhereWithoutOrganizationInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    orgId?: StringFilter<"User"> | string
    metadata?: JsonNullableFilter<"User">
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type VendorUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: VendorWhereUniqueInput
    update: XOR<VendorUpdateWithoutOrganizationInput, VendorUncheckedUpdateWithoutOrganizationInput>
    create: XOR<VendorCreateWithoutOrganizationInput, VendorUncheckedCreateWithoutOrganizationInput>
  }

  export type VendorUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: VendorWhereUniqueInput
    data: XOR<VendorUpdateWithoutOrganizationInput, VendorUncheckedUpdateWithoutOrganizationInput>
  }

  export type VendorUpdateManyWithWhereWithoutOrganizationInput = {
    where: VendorScalarWhereInput
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type VendorScalarWhereInput = {
    AND?: VendorScalarWhereInput | VendorScalarWhereInput[]
    OR?: VendorScalarWhereInput[]
    NOT?: VendorScalarWhereInput | VendorScalarWhereInput[]
    id?: StringFilter<"Vendor"> | string
    name?: StringFilter<"Vendor"> | string
    email?: StringFilter<"Vendor"> | string
    phone?: StringNullableFilter<"Vendor"> | string | null
    website?: StringNullableFilter<"Vendor"> | string | null
    address?: JsonNullableFilter<"Vendor">
    orgId?: StringFilter<"Vendor"> | string
    metadata?: JsonNullableFilter<"Vendor">
    isActive?: BoolFilter<"Vendor"> | boolean
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
  }

  export type ProcurementRequestUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: ProcurementRequestWhereUniqueInput
    update: XOR<ProcurementRequestUpdateWithoutOrganizationInput, ProcurementRequestUncheckedUpdateWithoutOrganizationInput>
    create: XOR<ProcurementRequestCreateWithoutOrganizationInput, ProcurementRequestUncheckedCreateWithoutOrganizationInput>
  }

  export type ProcurementRequestUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: ProcurementRequestWhereUniqueInput
    data: XOR<ProcurementRequestUpdateWithoutOrganizationInput, ProcurementRequestUncheckedUpdateWithoutOrganizationInput>
  }

  export type ProcurementRequestUpdateManyWithWhereWithoutOrganizationInput = {
    where: ProcurementRequestScalarWhereInput
    data: XOR<ProcurementRequestUpdateManyMutationInput, ProcurementRequestUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type ProcurementRequestScalarWhereInput = {
    AND?: ProcurementRequestScalarWhereInput | ProcurementRequestScalarWhereInput[]
    OR?: ProcurementRequestScalarWhereInput[]
    NOT?: ProcurementRequestScalarWhereInput | ProcurementRequestScalarWhereInput[]
    id?: StringFilter<"ProcurementRequest"> | string
    title?: StringFilter<"ProcurementRequest"> | string
    description?: StringNullableFilter<"ProcurementRequest"> | string | null
    items?: JsonFilter<"ProcurementRequest">
    status?: EnumRequestStatusFilter<"ProcurementRequest"> | $Enums.RequestStatus
    priority?: EnumRequestPriorityFilter<"ProcurementRequest"> | $Enums.RequestPriority
    orgId?: StringFilter<"ProcurementRequest"> | string
    createdBy?: StringFilter<"ProcurementRequest"> | string
    approvedVendorId?: StringNullableFilter<"ProcurementRequest"> | string | null
    approvedQuoteId?: StringNullableFilter<"ProcurementRequest"> | string | null
    metadata?: JsonNullableFilter<"ProcurementRequest">
    createdAt?: DateTimeFilter<"ProcurementRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ProcurementRequest"> | Date | string
    requestedBy?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ProcurementRequest"> | Date | string | null
  }

  export type QuoteUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: QuoteWhereUniqueInput
    update: XOR<QuoteUpdateWithoutOrganizationInput, QuoteUncheckedUpdateWithoutOrganizationInput>
    create: XOR<QuoteCreateWithoutOrganizationInput, QuoteUncheckedCreateWithoutOrganizationInput>
  }

  export type QuoteUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: QuoteWhereUniqueInput
    data: XOR<QuoteUpdateWithoutOrganizationInput, QuoteUncheckedUpdateWithoutOrganizationInput>
  }

  export type QuoteUpdateManyWithWhereWithoutOrganizationInput = {
    where: QuoteScalarWhereInput
    data: XOR<QuoteUpdateManyMutationInput, QuoteUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type QuoteScalarWhereInput = {
    AND?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
    OR?: QuoteScalarWhereInput[]
    NOT?: QuoteScalarWhereInput | QuoteScalarWhereInput[]
    id?: StringFilter<"Quote"> | string
    orgId?: StringFilter<"Quote"> | string
    requestId?: StringFilter<"Quote"> | string
    vendorId?: StringFilter<"Quote"> | string
    items?: JsonFilter<"Quote">
    totalAmount?: DecimalFilter<"Quote"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Quote"> | string
    deliveryDays?: IntNullableFilter<"Quote"> | number | null
    validUntil?: DateTimeNullableFilter<"Quote"> | Date | string | null
    terms?: JsonNullableFilter<"Quote">
    source?: EnumQuoteSourceFilter<"Quote"> | $Enums.QuoteSource
    rawData?: JsonNullableFilter<"Quote">
    confidence?: FloatNullableFilter<"Quote"> | number | null
    status?: EnumQuoteStatusFilter<"Quote"> | $Enums.QuoteStatus
    createdAt?: DateTimeFilter<"Quote"> | Date | string
    updatedAt?: DateTimeFilter<"Quote"> | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutOrganizationInput, PaymentUncheckedUpdateWithoutOrganizationInput>
    create: XOR<PaymentCreateWithoutOrganizationInput, PaymentUncheckedCreateWithoutOrganizationInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutOrganizationInput, PaymentUncheckedUpdateWithoutOrganizationInput>
  }

  export type PaymentUpdateManyWithWhereWithoutOrganizationInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    orgId?: StringFilter<"Payment"> | string
    requestId?: StringFilter<"Payment"> | string
    quoteId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    stripePaymentIntentId?: StringNullableFilter<"Payment"> | string | null
    stripeChargeId?: StringNullableFilter<"Payment"> | string | null
    method?: StringNullableFilter<"Payment"> | string | null
    metadata?: JsonNullableFilter<"Payment">
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    paidAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
  }

  export type AuditLogUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutOrganizationInput, AuditLogUncheckedUpdateWithoutOrganizationInput>
    create: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutOrganizationInput, AuditLogUncheckedUpdateWithoutOrganizationInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutOrganizationInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    orgId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    requestId?: StringNullableFilter<"AuditLog"> | string | null
  }

  export type OrganizationCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    vendors?: VendorCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteCreateNestedManyWithoutOrganizationInput
    payments?: PaymentCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    vendors?: VendorUncheckedCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteUncheckedCreateNestedManyWithoutOrganizationInput
    payments?: PaymentUncheckedCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
  }

  export type ProcurementRequestCreateWithoutCreatorInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutRequestsInput
    quotes?: QuoteCreateNestedManyWithoutRequestInput
    payments?: PaymentCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUncheckedCreateWithoutCreatorInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    quotes?: QuoteUncheckedCreateNestedManyWithoutRequestInput
    payments?: PaymentUncheckedCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestCreateOrConnectWithoutCreatorInput = {
    where: ProcurementRequestWhereUniqueInput
    create: XOR<ProcurementRequestCreateWithoutCreatorInput, ProcurementRequestUncheckedCreateWithoutCreatorInput>
  }

  export type ProcurementRequestCreateManyCreatorInputEnvelope = {
    data: ProcurementRequestCreateManyCreatorInput | ProcurementRequestCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutAuditLogsInput
    request?: ProcurementRequestCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    requestId?: string | null
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutUsersInput = {
    update: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendors?: VendorUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vendors?: VendorUncheckedUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUncheckedUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type ProcurementRequestUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ProcurementRequestWhereUniqueInput
    update: XOR<ProcurementRequestUpdateWithoutCreatorInput, ProcurementRequestUncheckedUpdateWithoutCreatorInput>
    create: XOR<ProcurementRequestCreateWithoutCreatorInput, ProcurementRequestUncheckedCreateWithoutCreatorInput>
  }

  export type ProcurementRequestUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ProcurementRequestWhereUniqueInput
    data: XOR<ProcurementRequestUpdateWithoutCreatorInput, ProcurementRequestUncheckedUpdateWithoutCreatorInput>
  }

  export type ProcurementRequestUpdateManyWithWhereWithoutCreatorInput = {
    where: ProcurementRequestScalarWhereInput
    data: XOR<ProcurementRequestUpdateManyMutationInput, ProcurementRequestUncheckedUpdateManyWithoutCreatorInput>
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type OrganizationCreateWithoutVendorsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteCreateNestedManyWithoutOrganizationInput
    payments?: PaymentCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutVendorsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteUncheckedCreateNestedManyWithoutOrganizationInput
    payments?: PaymentUncheckedCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutVendorsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutVendorsInput, OrganizationUncheckedCreateWithoutVendorsInput>
  }

  export type QuoteCreateWithoutVendorInput = {
    id?: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutQuotesInput
    request: ProcurementRequestCreateNestedOneWithoutQuotesInput
    payments?: PaymentCreateNestedManyWithoutQuoteInput
  }

  export type QuoteUncheckedCreateWithoutVendorInput = {
    id?: string
    orgId: string
    requestId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutQuoteInput
  }

  export type QuoteCreateOrConnectWithoutVendorInput = {
    where: QuoteWhereUniqueInput
    create: XOR<QuoteCreateWithoutVendorInput, QuoteUncheckedCreateWithoutVendorInput>
  }

  export type QuoteCreateManyVendorInputEnvelope = {
    data: QuoteCreateManyVendorInput | QuoteCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutVendorsInput = {
    update: XOR<OrganizationUpdateWithoutVendorsInput, OrganizationUncheckedUpdateWithoutVendorsInput>
    create: XOR<OrganizationCreateWithoutVendorsInput, OrganizationUncheckedCreateWithoutVendorsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutVendorsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutVendorsInput, OrganizationUncheckedUpdateWithoutVendorsInput>
  }

  export type OrganizationUpdateWithoutVendorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutVendorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUncheckedUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type QuoteUpsertWithWhereUniqueWithoutVendorInput = {
    where: QuoteWhereUniqueInput
    update: XOR<QuoteUpdateWithoutVendorInput, QuoteUncheckedUpdateWithoutVendorInput>
    create: XOR<QuoteCreateWithoutVendorInput, QuoteUncheckedCreateWithoutVendorInput>
  }

  export type QuoteUpdateWithWhereUniqueWithoutVendorInput = {
    where: QuoteWhereUniqueInput
    data: XOR<QuoteUpdateWithoutVendorInput, QuoteUncheckedUpdateWithoutVendorInput>
  }

  export type QuoteUpdateManyWithWhereWithoutVendorInput = {
    where: QuoteScalarWhereInput
    data: XOR<QuoteUpdateManyMutationInput, QuoteUncheckedUpdateManyWithoutVendorInput>
  }

  export type OrganizationCreateWithoutRequestsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    vendors?: VendorCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteCreateNestedManyWithoutOrganizationInput
    payments?: PaymentCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutRequestsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    vendors?: VendorUncheckedCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteUncheckedCreateNestedManyWithoutOrganizationInput
    payments?: PaymentUncheckedCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutRequestsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutRequestsInput, OrganizationUncheckedCreateWithoutRequestsInput>
  }

  export type UserCreateWithoutCreatedRequestsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutUsersInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedRequestsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedRequestsInput, UserUncheckedCreateWithoutCreatedRequestsInput>
  }

  export type QuoteCreateWithoutRequestInput = {
    id?: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutQuotesInput
    vendor: VendorCreateNestedOneWithoutQuotesInput
    payments?: PaymentCreateNestedManyWithoutQuoteInput
  }

  export type QuoteUncheckedCreateWithoutRequestInput = {
    id?: string
    orgId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutQuoteInput
  }

  export type QuoteCreateOrConnectWithoutRequestInput = {
    where: QuoteWhereUniqueInput
    create: XOR<QuoteCreateWithoutRequestInput, QuoteUncheckedCreateWithoutRequestInput>
  }

  export type QuoteCreateManyRequestInputEnvelope = {
    data: QuoteCreateManyRequestInput | QuoteCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutRequestInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutPaymentsInput
    quote: QuoteCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutRequestInput = {
    id?: string
    orgId: string
    quoteId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type PaymentCreateOrConnectWithoutRequestInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutRequestInput, PaymentUncheckedCreateWithoutRequestInput>
  }

  export type PaymentCreateManyRequestInputEnvelope = {
    data: PaymentCreateManyRequestInput | PaymentCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutRequestInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutAuditLogsInput
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutRequestInput = {
    id?: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutRequestInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutRequestInput, AuditLogUncheckedCreateWithoutRequestInput>
  }

  export type AuditLogCreateManyRequestInputEnvelope = {
    data: AuditLogCreateManyRequestInput | AuditLogCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutRequestsInput = {
    update: XOR<OrganizationUpdateWithoutRequestsInput, OrganizationUncheckedUpdateWithoutRequestsInput>
    create: XOR<OrganizationCreateWithoutRequestsInput, OrganizationUncheckedCreateWithoutRequestsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutRequestsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutRequestsInput, OrganizationUncheckedUpdateWithoutRequestsInput>
  }

  export type OrganizationUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUncheckedUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUncheckedUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type UserUpsertWithoutCreatedRequestsInput = {
    update: XOR<UserUpdateWithoutCreatedRequestsInput, UserUncheckedUpdateWithoutCreatedRequestsInput>
    create: XOR<UserCreateWithoutCreatedRequestsInput, UserUncheckedCreateWithoutCreatedRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedRequestsInput, UserUncheckedUpdateWithoutCreatedRequestsInput>
  }

  export type UserUpdateWithoutCreatedRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type QuoteUpsertWithWhereUniqueWithoutRequestInput = {
    where: QuoteWhereUniqueInput
    update: XOR<QuoteUpdateWithoutRequestInput, QuoteUncheckedUpdateWithoutRequestInput>
    create: XOR<QuoteCreateWithoutRequestInput, QuoteUncheckedCreateWithoutRequestInput>
  }

  export type QuoteUpdateWithWhereUniqueWithoutRequestInput = {
    where: QuoteWhereUniqueInput
    data: XOR<QuoteUpdateWithoutRequestInput, QuoteUncheckedUpdateWithoutRequestInput>
  }

  export type QuoteUpdateManyWithWhereWithoutRequestInput = {
    where: QuoteScalarWhereInput
    data: XOR<QuoteUpdateManyMutationInput, QuoteUncheckedUpdateManyWithoutRequestInput>
  }

  export type PaymentUpsertWithWhereUniqueWithoutRequestInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutRequestInput, PaymentUncheckedUpdateWithoutRequestInput>
    create: XOR<PaymentCreateWithoutRequestInput, PaymentUncheckedCreateWithoutRequestInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutRequestInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutRequestInput, PaymentUncheckedUpdateWithoutRequestInput>
  }

  export type PaymentUpdateManyWithWhereWithoutRequestInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutRequestInput>
  }

  export type AuditLogUpsertWithWhereUniqueWithoutRequestInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutRequestInput, AuditLogUncheckedUpdateWithoutRequestInput>
    create: XOR<AuditLogCreateWithoutRequestInput, AuditLogUncheckedCreateWithoutRequestInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutRequestInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutRequestInput, AuditLogUncheckedUpdateWithoutRequestInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutRequestInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutRequestInput>
  }

  export type OrganizationCreateWithoutQuotesInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    vendors?: VendorCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestCreateNestedManyWithoutOrganizationInput
    payments?: PaymentCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutQuotesInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    vendors?: VendorUncheckedCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput
    payments?: PaymentUncheckedCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutQuotesInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutQuotesInput, OrganizationUncheckedCreateWithoutQuotesInput>
  }

  export type ProcurementRequestCreateWithoutQuotesInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutRequestsInput
    creator: UserCreateNestedOneWithoutCreatedRequestsInput
    payments?: PaymentCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUncheckedCreateWithoutQuotesInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    payments?: PaymentUncheckedCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestCreateOrConnectWithoutQuotesInput = {
    where: ProcurementRequestWhereUniqueInput
    create: XOR<ProcurementRequestCreateWithoutQuotesInput, ProcurementRequestUncheckedCreateWithoutQuotesInput>
  }

  export type VendorCreateWithoutQuotesInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutVendorsInput
  }

  export type VendorUncheckedCreateWithoutQuotesInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorCreateOrConnectWithoutQuotesInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutQuotesInput, VendorUncheckedCreateWithoutQuotesInput>
  }

  export type PaymentCreateWithoutQuoteInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutPaymentsInput
    request: ProcurementRequestCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutQuoteInput = {
    id?: string
    orgId: string
    requestId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type PaymentCreateOrConnectWithoutQuoteInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutQuoteInput, PaymentUncheckedCreateWithoutQuoteInput>
  }

  export type PaymentCreateManyQuoteInputEnvelope = {
    data: PaymentCreateManyQuoteInput | PaymentCreateManyQuoteInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutQuotesInput = {
    update: XOR<OrganizationUpdateWithoutQuotesInput, OrganizationUncheckedUpdateWithoutQuotesInput>
    create: XOR<OrganizationCreateWithoutQuotesInput, OrganizationUncheckedCreateWithoutQuotesInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutQuotesInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutQuotesInput, OrganizationUncheckedUpdateWithoutQuotesInput>
  }

  export type OrganizationUpdateWithoutQuotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutQuotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUncheckedUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type ProcurementRequestUpsertWithoutQuotesInput = {
    update: XOR<ProcurementRequestUpdateWithoutQuotesInput, ProcurementRequestUncheckedUpdateWithoutQuotesInput>
    create: XOR<ProcurementRequestCreateWithoutQuotesInput, ProcurementRequestUncheckedCreateWithoutQuotesInput>
    where?: ProcurementRequestWhereInput
  }

  export type ProcurementRequestUpdateToOneWithWhereWithoutQuotesInput = {
    where?: ProcurementRequestWhereInput
    data: XOR<ProcurementRequestUpdateWithoutQuotesInput, ProcurementRequestUncheckedUpdateWithoutQuotesInput>
  }

  export type ProcurementRequestUpdateWithoutQuotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutRequestsNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedRequestsNestedInput
    payments?: PaymentUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateWithoutQuotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    payments?: PaymentUncheckedUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type VendorUpsertWithoutQuotesInput = {
    update: XOR<VendorUpdateWithoutQuotesInput, VendorUncheckedUpdateWithoutQuotesInput>
    create: XOR<VendorCreateWithoutQuotesInput, VendorUncheckedCreateWithoutQuotesInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutQuotesInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutQuotesInput, VendorUncheckedUpdateWithoutQuotesInput>
  }

  export type VendorUpdateWithoutQuotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutVendorsNestedInput
  }

  export type VendorUncheckedUpdateWithoutQuotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutQuoteInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutQuoteInput, PaymentUncheckedUpdateWithoutQuoteInput>
    create: XOR<PaymentCreateWithoutQuoteInput, PaymentUncheckedCreateWithoutQuoteInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutQuoteInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutQuoteInput, PaymentUncheckedUpdateWithoutQuoteInput>
  }

  export type PaymentUpdateManyWithWhereWithoutQuoteInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutQuoteInput>
  }

  export type OrganizationCreateWithoutPaymentsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    vendors?: VendorCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutPaymentsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    vendors?: VendorUncheckedCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteUncheckedCreateNestedManyWithoutOrganizationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutPaymentsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutPaymentsInput, OrganizationUncheckedCreateWithoutPaymentsInput>
  }

  export type ProcurementRequestCreateWithoutPaymentsInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutRequestsInput
    creator: UserCreateNestedOneWithoutCreatedRequestsInput
    quotes?: QuoteCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUncheckedCreateWithoutPaymentsInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    quotes?: QuoteUncheckedCreateNestedManyWithoutRequestInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestCreateOrConnectWithoutPaymentsInput = {
    where: ProcurementRequestWhereUniqueInput
    create: XOR<ProcurementRequestCreateWithoutPaymentsInput, ProcurementRequestUncheckedCreateWithoutPaymentsInput>
  }

  export type QuoteCreateWithoutPaymentsInput = {
    id?: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutQuotesInput
    request: ProcurementRequestCreateNestedOneWithoutQuotesInput
    vendor: VendorCreateNestedOneWithoutQuotesInput
  }

  export type QuoteUncheckedCreateWithoutPaymentsInput = {
    id?: string
    orgId: string
    requestId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuoteCreateOrConnectWithoutPaymentsInput = {
    where: QuoteWhereUniqueInput
    create: XOR<QuoteCreateWithoutPaymentsInput, QuoteUncheckedCreateWithoutPaymentsInput>
  }

  export type OrganizationUpsertWithoutPaymentsInput = {
    update: XOR<OrganizationUpdateWithoutPaymentsInput, OrganizationUncheckedUpdateWithoutPaymentsInput>
    create: XOR<OrganizationCreateWithoutPaymentsInput, OrganizationUncheckedCreateWithoutPaymentsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutPaymentsInput, OrganizationUncheckedUpdateWithoutPaymentsInput>
  }

  export type OrganizationUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUncheckedUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUncheckedUpdateManyWithoutOrganizationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type ProcurementRequestUpsertWithoutPaymentsInput = {
    update: XOR<ProcurementRequestUpdateWithoutPaymentsInput, ProcurementRequestUncheckedUpdateWithoutPaymentsInput>
    create: XOR<ProcurementRequestCreateWithoutPaymentsInput, ProcurementRequestUncheckedCreateWithoutPaymentsInput>
    where?: ProcurementRequestWhereInput
  }

  export type ProcurementRequestUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: ProcurementRequestWhereInput
    data: XOR<ProcurementRequestUpdateWithoutPaymentsInput, ProcurementRequestUncheckedUpdateWithoutPaymentsInput>
  }

  export type ProcurementRequestUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutRequestsNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedRequestsNestedInput
    quotes?: QuoteUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    quotes?: QuoteUncheckedUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type QuoteUpsertWithoutPaymentsInput = {
    update: XOR<QuoteUpdateWithoutPaymentsInput, QuoteUncheckedUpdateWithoutPaymentsInput>
    create: XOR<QuoteCreateWithoutPaymentsInput, QuoteUncheckedCreateWithoutPaymentsInput>
    where?: QuoteWhereInput
  }

  export type QuoteUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: QuoteWhereInput
    data: XOR<QuoteUpdateWithoutPaymentsInput, QuoteUncheckedUpdateWithoutPaymentsInput>
  }

  export type QuoteUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutQuotesNestedInput
    request?: ProcurementRequestUpdateOneRequiredWithoutQuotesNestedInput
    vendor?: VendorUpdateOneRequiredWithoutQuotesNestedInput
  }

  export type QuoteUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    vendors?: VendorCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteCreateNestedManyWithoutOrganizationInput
    payments?: PaymentCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    slug: string
    logo?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    vendors?: VendorUncheckedCreateNestedManyWithoutOrganizationInput
    requests?: ProcurementRequestUncheckedCreateNestedManyWithoutOrganizationInput
    quotes?: QuoteUncheckedCreateNestedManyWithoutOrganizationInput
    payments?: PaymentUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutAuditLogsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutAuditLogsInput, OrganizationUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutUsersInput
    createdRequests?: ProcurementRequestCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    orgId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdRequests?: ProcurementRequestUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type ProcurementRequestCreateWithoutAuditLogsInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutRequestsInput
    creator: UserCreateNestedOneWithoutCreatedRequestsInput
    quotes?: QuoteCreateNestedManyWithoutRequestInput
    payments?: PaymentCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
    quotes?: QuoteUncheckedCreateNestedManyWithoutRequestInput
    payments?: PaymentUncheckedCreateNestedManyWithoutRequestInput
  }

  export type ProcurementRequestCreateOrConnectWithoutAuditLogsInput = {
    where: ProcurementRequestWhereUniqueInput
    create: XOR<ProcurementRequestCreateWithoutAuditLogsInput, ProcurementRequestUncheckedCreateWithoutAuditLogsInput>
  }

  export type OrganizationUpsertWithoutAuditLogsInput = {
    update: XOR<OrganizationUpdateWithoutAuditLogsInput, OrganizationUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<OrganizationCreateWithoutAuditLogsInput, OrganizationUncheckedCreateWithoutAuditLogsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutAuditLogsInput, OrganizationUncheckedUpdateWithoutAuditLogsInput>
  }

  export type OrganizationUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    vendors?: VendorUncheckedUpdateManyWithoutOrganizationNestedInput
    requests?: ProcurementRequestUncheckedUpdateManyWithoutOrganizationNestedInput
    quotes?: QuoteUncheckedUpdateManyWithoutOrganizationNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    createdRequests?: ProcurementRequestUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orgId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdRequests?: ProcurementRequestUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type ProcurementRequestUpsertWithoutAuditLogsInput = {
    update: XOR<ProcurementRequestUpdateWithoutAuditLogsInput, ProcurementRequestUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<ProcurementRequestCreateWithoutAuditLogsInput, ProcurementRequestUncheckedCreateWithoutAuditLogsInput>
    where?: ProcurementRequestWhereInput
  }

  export type ProcurementRequestUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: ProcurementRequestWhereInput
    data: XOR<ProcurementRequestUpdateWithoutAuditLogsInput, ProcurementRequestUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ProcurementRequestUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutRequestsNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedRequestsNestedInput
    quotes?: QuoteUpdateManyWithoutRequestNestedInput
    payments?: PaymentUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    quotes?: QuoteUncheckedUpdateManyWithoutRequestNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type EmailMessageCreateWithoutThreadInput = {
    id?: string
    gmailMessageId: string
    sender: string
    to: JsonNullValueInput | InputJsonValue
    subject: string
    body: string
    isProcessed?: boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    receivedAt: Date | string
  }

  export type EmailMessageUncheckedCreateWithoutThreadInput = {
    id?: string
    gmailMessageId: string
    sender: string
    to: JsonNullValueInput | InputJsonValue
    subject: string
    body: string
    isProcessed?: boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    receivedAt: Date | string
  }

  export type EmailMessageCreateOrConnectWithoutThreadInput = {
    where: EmailMessageWhereUniqueInput
    create: XOR<EmailMessageCreateWithoutThreadInput, EmailMessageUncheckedCreateWithoutThreadInput>
  }

  export type EmailMessageCreateManyThreadInputEnvelope = {
    data: EmailMessageCreateManyThreadInput | EmailMessageCreateManyThreadInput[]
    skipDuplicates?: boolean
  }

  export type EmailMessageUpsertWithWhereUniqueWithoutThreadInput = {
    where: EmailMessageWhereUniqueInput
    update: XOR<EmailMessageUpdateWithoutThreadInput, EmailMessageUncheckedUpdateWithoutThreadInput>
    create: XOR<EmailMessageCreateWithoutThreadInput, EmailMessageUncheckedCreateWithoutThreadInput>
  }

  export type EmailMessageUpdateWithWhereUniqueWithoutThreadInput = {
    where: EmailMessageWhereUniqueInput
    data: XOR<EmailMessageUpdateWithoutThreadInput, EmailMessageUncheckedUpdateWithoutThreadInput>
  }

  export type EmailMessageUpdateManyWithWhereWithoutThreadInput = {
    where: EmailMessageScalarWhereInput
    data: XOR<EmailMessageUpdateManyMutationInput, EmailMessageUncheckedUpdateManyWithoutThreadInput>
  }

  export type EmailMessageScalarWhereInput = {
    AND?: EmailMessageScalarWhereInput | EmailMessageScalarWhereInput[]
    OR?: EmailMessageScalarWhereInput[]
    NOT?: EmailMessageScalarWhereInput | EmailMessageScalarWhereInput[]
    id?: StringFilter<"EmailMessage"> | string
    threadId?: StringFilter<"EmailMessage"> | string
    gmailMessageId?: StringFilter<"EmailMessage"> | string
    sender?: StringFilter<"EmailMessage"> | string
    to?: JsonFilter<"EmailMessage">
    subject?: StringFilter<"EmailMessage"> | string
    body?: StringFilter<"EmailMessage"> | string
    isProcessed?: BoolFilter<"EmailMessage"> | boolean
    extractedData?: JsonNullableFilter<"EmailMessage">
    attachments?: JsonNullableFilter<"EmailMessage">
    createdAt?: DateTimeFilter<"EmailMessage"> | Date | string
    receivedAt?: DateTimeFilter<"EmailMessage"> | Date | string
  }

  export type EmailThreadCreateWithoutMessagesInput = {
    id?: string
    orgId: string
    gmailThreadId: string
    subject: string
    participants: JsonNullValueInput | InputJsonValue
    requestId?: string | null
    lastMessageAt: Date | string
    messageCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmailThreadUncheckedCreateWithoutMessagesInput = {
    id?: string
    orgId: string
    gmailThreadId: string
    subject: string
    participants: JsonNullValueInput | InputJsonValue
    requestId?: string | null
    lastMessageAt: Date | string
    messageCount?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmailThreadCreateOrConnectWithoutMessagesInput = {
    where: EmailThreadWhereUniqueInput
    create: XOR<EmailThreadCreateWithoutMessagesInput, EmailThreadUncheckedCreateWithoutMessagesInput>
  }

  export type EmailThreadUpsertWithoutMessagesInput = {
    update: XOR<EmailThreadUpdateWithoutMessagesInput, EmailThreadUncheckedUpdateWithoutMessagesInput>
    create: XOR<EmailThreadCreateWithoutMessagesInput, EmailThreadUncheckedCreateWithoutMessagesInput>
    where?: EmailThreadWhereInput
  }

  export type EmailThreadUpdateToOneWithWhereWithoutMessagesInput = {
    where?: EmailThreadWhereInput
    data: XOR<EmailThreadUpdateWithoutMessagesInput, EmailThreadUncheckedUpdateWithoutMessagesInput>
  }

  export type EmailThreadUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    gmailThreadId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailThreadUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    gmailThreadId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageCount?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyOrganizationInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VendorCreateManyOrganizationInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    website?: string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProcurementRequestCreateManyOrganizationInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    createdBy: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type QuoteCreateManyOrganizationInput = {
    id?: string
    requestId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateManyOrganizationInput = {
    id?: string
    requestId: string
    quoteId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type AuditLogCreateManyOrganizationInput = {
    id?: string
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    requestId?: string | null
  }

  export type UserUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdRequests?: ProcurementRequestUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdRequests?: ProcurementRequestUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotes?: QuoteUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotes?: QuoteUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcurementRequestUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedRequestsNestedInput
    quotes?: QuoteUpdateManyWithoutRequestNestedInput
    payments?: PaymentUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    quotes?: QuoteUncheckedUpdateManyWithoutRequestNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuoteUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: ProcurementRequestUpdateOneRequiredWithoutQuotesNestedInput
    vendor?: VendorUpdateOneRequiredWithoutQuotesNestedInput
    payments?: PaymentUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    request?: ProcurementRequestUpdateOneRequiredWithoutPaymentsNestedInput
    quote?: QuoteUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    quoteId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    quoteId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
    request?: ProcurementRequestUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProcurementRequestCreateManyCreatorInput = {
    id?: string
    title: string
    description?: string | null
    items: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    priority?: $Enums.RequestPriority
    orgId: string
    approvedVendorId?: string | null
    approvedQuoteId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    requestedBy?: Date | string | null
    approvedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    requestId?: string | null
  }

  export type ProcurementRequestUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutRequestsNestedInput
    quotes?: QuoteUpdateManyWithoutRequestNestedInput
    payments?: PaymentUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    quotes?: QuoteUncheckedUpdateManyWithoutRequestNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutRequestNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type ProcurementRequestUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    items?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    priority?: EnumRequestPriorityFieldUpdateOperationsInput | $Enums.RequestPriority
    orgId?: StringFieldUpdateOperationsInput | string
    approvedVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    approvedQuoteId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestedBy?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutAuditLogsNestedInput
    request?: ProcurementRequestUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuoteCreateManyVendorInput = {
    id?: string
    orgId: string
    requestId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuoteUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutQuotesNestedInput
    request?: ProcurementRequestUpdateOneRequiredWithoutQuotesNestedInput
    payments?: PaymentUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuoteCreateManyRequestInput = {
    id?: string
    orgId: string
    vendorId: string
    items: JsonNullValueInput | InputJsonValue
    totalAmount: Decimal | DecimalJsLike | number | string
    currency?: string
    deliveryDays?: number | null
    validUntil?: Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number | null
    status?: $Enums.QuoteStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateManyRequestInput = {
    id?: string
    orgId: string
    quoteId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type AuditLogCreateManyRequestInput = {
    id?: string
    orgId: string
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type QuoteUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutQuotesNestedInput
    vendor?: VendorUpdateOneRequiredWithoutQuotesNestedInput
    payments?: PaymentUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutQuoteNestedInput
  }

  export type QuoteUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    items?: JsonNullValueInput | InputJsonValue
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    deliveryDays?: NullableIntFieldUpdateOperationsInput | number | null
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    terms?: NullableJsonNullValueInput | InputJsonValue
    source?: EnumQuoteSourceFieldUpdateOperationsInput | $Enums.QuoteSource
    rawData?: NullableJsonNullValueInput | InputJsonValue
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumQuoteStatusFieldUpdateOperationsInput | $Enums.QuoteStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutPaymentsNestedInput
    quote?: QuoteUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    quoteId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    quoteId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutAuditLogsNestedInput
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyQuoteInput = {
    id?: string
    orgId: string
    requestId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: $Enums.PaymentStatus
    stripePaymentIntentId?: string | null
    stripeChargeId?: string | null
    method?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type PaymentUpdateWithoutQuoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutPaymentsNestedInput
    request?: ProcurementRequestUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutQuoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutQuoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeChargeId?: NullableStringFieldUpdateOperationsInput | string | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EmailMessageCreateManyThreadInput = {
    id?: string
    gmailMessageId: string
    sender: string
    to: JsonNullValueInput | InputJsonValue
    subject: string
    body: string
    isProcessed?: boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    receivedAt: Date | string
  }

  export type EmailMessageUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailMessageUncheckedUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailMessageUncheckedUpdateManyWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailMessageId?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    to?: JsonNullValueInput | InputJsonValue
    subject?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    extractedData?: NullableJsonNullValueInput | InputJsonValue
    attachments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use OrganizationCountOutputTypeDefaultArgs instead
     */
    export type OrganizationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganizationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VendorCountOutputTypeDefaultArgs instead
     */
    export type VendorCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VendorCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProcurementRequestCountOutputTypeDefaultArgs instead
     */
    export type ProcurementRequestCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProcurementRequestCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuoteCountOutputTypeDefaultArgs instead
     */
    export type QuoteCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuoteCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmailThreadCountOutputTypeDefaultArgs instead
     */
    export type EmailThreadCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmailThreadCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrganizationDefaultArgs instead
     */
    export type OrganizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganizationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VendorDefaultArgs instead
     */
    export type VendorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VendorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProcurementRequestDefaultArgs instead
     */
    export type ProcurementRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProcurementRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuoteDefaultArgs instead
     */
    export type QuoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuoteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentDefaultArgs instead
     */
    export type PaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditLogDefaultArgs instead
     */
    export type AuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmailThreadDefaultArgs instead
     */
    export type EmailThreadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmailThreadDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmailMessageDefaultArgs instead
     */
    export type EmailMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmailMessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowExecutionDefaultArgs instead
     */
    export type WorkflowExecutionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowExecutionDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}