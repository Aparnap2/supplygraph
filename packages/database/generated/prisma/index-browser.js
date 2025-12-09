
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  role: 'role'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  logo: 'logo',
  website: 'website',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MemberScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  role: 'role',
  invitedBy: 'invitedBy',
  joinedAt: 'joinedAt',
  lastLoginAt: 'lastLoginAt'
};

exports.Prisma.OrganizationSettingsScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  approvalRequired: 'approvalRequired',
  approvalAmount: 'approvalAmount',
  autoVendorMatching: 'autoVendorMatching',
  emailNotifications: 'emailNotifications',
  slackWebhook: 'slackWebhook',
  stripeEnabled: 'stripeEnabled',
  stripeAccountId: 'stripeAccountId',
  currency: 'currency',
  timezone: 'timezone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  slug: 'slug',
  organizationId: 'organizationId',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  code: 'code',
  organizationId: 'organizationId',
  budget: 'budget',
  managerId: 'managerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  sku: 'sku',
  name: 'name',
  description: 'description',
  categoryId: 'categoryId',
  organizationId: 'organizationId',
  unit: 'unit',
  unitPrice: 'unitPrice',
  currentStock: 'currentStock',
  minStock: 'minStock',
  maxStock: 'maxStock',
  reorderPoint: 'reorderPoint',
  supplier: 'supplier',
  specifications: 'specifications',
  images: 'images',
  tags: 'tags',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  website: 'website',
  description: 'description',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  country: 'country',
  postalCode: 'postalCode',
  taxId: 'taxId',
  paymentTerms: 'paymentTerms',
  rating: 'rating',
  organizationId: 'organizationId',
  tags: 'tags',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorContactScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  title: 'title',
  email: 'email',
  phone: 'phone',
  isPrimary: 'isPrimary'
};

exports.Prisma.VendorContractScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  contractNumber: 'contractNumber',
  startDate: 'startDate',
  endDate: 'endDate',
  terms: 'terms',
  autoRenew: 'autoRenew',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProcurementRequestScalarFieldEnum = {
  id: 'id',
  requestNumber: 'requestNumber',
  title: 'title',
  description: 'description',
  organizationId: 'organizationId',
  requesterId: 'requesterId',
  departmentId: 'departmentId',
  status: 'status',
  priority: 'priority',
  threadId: 'threadId',
  workflowState: 'workflowState',
  totalAmount: 'totalAmount',
  currency: 'currency',
  requiresApproval: 'requiresApproval',
  approverId: 'approverId',
  approvedAt: 'approvedAt',
  approvedBy: 'approvedBy',
  neededBy: 'neededBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  completedAt: 'completedAt'
};

exports.Prisma.ProcurementItemScalarFieldEnum = {
  id: 'id',
  requestId: 'requestId',
  productId: 'productId',
  name: 'name',
  description: 'description',
  quantity: 'quantity',
  unit: 'unit',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  specifications: 'specifications',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProcurementTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  organizationId: 'organizationId',
  departmentId: 'departmentId',
  categoryId: 'categoryId',
  items: 'items',
  workflow: 'workflow',
  approvalRules: 'approvalRules',
  isActive: 'isActive',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuoteScalarFieldEnum = {
  id: 'id',
  quoteNumber: 'quoteNumber',
  requestId: 'requestId',
  vendorId: 'vendorId',
  organizationId: 'organizationId',
  status: 'status',
  validUntil: 'validUntil',
  subtotal: 'subtotal',
  tax: 'tax',
  shipping: 'shipping',
  totalAmount: 'totalAmount',
  currency: 'currency',
  terms: 'terms',
  notes: 'notes',
  attachments: 'attachments',
  responseDate: 'responseDate',
  respondedBy: 'respondedBy',
  receivedVia: 'receivedVia',
  aiGenerated: 'aiGenerated',
  confidence: 'confidence',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuoteItemScalarFieldEnum = {
  id: 'id',
  quoteId: 'quoteId',
  requestItemId: 'requestItemId',
  name: 'name',
  description: 'description',
  quantity: 'quantity',
  unit: 'unit',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  productId: 'productId',
  specifications: 'specifications',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LangGraphThreadScalarFieldEnum = {
  id: 'id',
  threadId: 'threadId',
  organizationId: 'organizationId',
  requestId: 'requestId',
  state: 'state',
  status: 'status',
  currentNode: 'currentNode',
  metadata: 'metadata',
  sentiment: 'sentiment',
  confidence: 'confidence',
  riskScore: 'riskScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  completedAt: 'completedAt'
};

exports.Prisma.AISuggestionScalarFieldEnum = {
  id: 'id',
  type: 'type',
  organizationId: 'organizationId',
  requestId: 'requestId',
  threadId: 'threadId',
  title: 'title',
  description: 'description',
  data: 'data',
  confidence: 'confidence',
  reasoning: 'reasoning',
  status: 'status',
  appliedAt: 'appliedAt',
  appliedBy: 'appliedBy',
  model: 'model',
  version: 'version',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  action: 'action',
  resourceType: 'resourceType',
  resourceId: 'resourceId',
  oldValues: 'oldValues',
  newValues: 'newValues',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  sessionId: 'sessionId',
  requestId: 'requestId',
  threadId: 'threadId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  type: 'type',
  title: 'title',
  description: 'description',
  resourceType: 'resourceType',
  resourceId: 'resourceId',
  userId: 'userId',
  data: 'data',
  isPublic: 'isPublic',
  isVisibleToAll: 'isVisibleToAll',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

exports.OrganizationRole = exports.$Enums.OrganizationRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER'
};

exports.ProcurementStatus = exports.$Enums.ProcurementStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  NEGOTIATING: 'NEGOTIATING',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.Priority = exports.$Enums.Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.ItemStatus = exports.$Enums.ItemStatus = {
  PENDING: 'PENDING',
  QUOTED: 'QUOTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ORDERED: 'ORDERED',
  RECEIVED: 'RECEIVED',
  CANCELLED: 'CANCELLED'
};

exports.QuoteStatus = exports.$Enums.QuoteStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

exports.SuggestionType = exports.$Enums.SuggestionType = {
  VENDOR_MATCH: 'VENDOR_MATCH',
  PRICE_OPTIMIZATION: 'PRICE_OPTIMIZATION',
  BULK_PURCHASE: 'BULK_PURCHASE',
  ALTERNATIVE_PRODUCT: 'ALTERNATIVE_PRODUCT',
  RISK_MITIGATION: 'RISK_MITIGATION',
  WORKFLOW_IMPROVEMENT: 'WORKFLOW_IMPROVEMENT'
};

exports.SuggestionStatus = exports.$Enums.SuggestionStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

exports.ActivityType = exports.$Enums.ActivityType = {
  PROCUREMENT_CREATED: 'PROCUREMENT_CREATED',
  PROCUREMENT_UPDATED: 'PROCUREMENT_UPDATED',
  PROCUREMENT_APPROVED: 'PROCUREMENT_APPROVED',
  PROCUREMENT_REJECTED: 'PROCUREMENT_REJECTED',
  QUOTE_RECEIVED: 'QUOTE_RECEIVED',
  QUOTE_ACCEPTED: 'QUOTE_ACCEPTED',
  VENDOR_ADDED: 'VENDOR_ADDED',
  PRODUCT_ADDED: 'PRODUCT_ADDED',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  PAYMENT_PROCESSED: 'PAYMENT_PROCESSED',
  AI_SUGGESTION: 'AI_SUGGESTION',
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION'
};

exports.Prisma.ModelName = {
  Account: 'Account',
  Session: 'Session',
  User: 'User',
  VerificationToken: 'VerificationToken',
  Organization: 'Organization',
  Member: 'Member',
  OrganizationSettings: 'OrganizationSettings',
  Category: 'Category',
  Department: 'Department',
  Product: 'Product',
  Vendor: 'Vendor',
  VendorContact: 'VendorContact',
  VendorContract: 'VendorContract',
  ProcurementRequest: 'ProcurementRequest',
  ProcurementItem: 'ProcurementItem',
  ProcurementTemplate: 'ProcurementTemplate',
  Quote: 'Quote',
  QuoteItem: 'QuoteItem',
  LangGraphThread: 'LangGraphThread',
  AISuggestion: 'AISuggestion',
  AuditLog: 'AuditLog',
  Activity: 'Activity'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
