export interface SeedConfig {
  organizations: number
  usersPerOrg: number
  departmentsPerOrg: number
  categoriesPerOrg: number
  productsPerOrg: number
  vendorsPerOrg: number
  procurementRequestsPerOrg: number
  quotesPerRequest: number
  activitiesPerOrg: number
}

export const DEFAULT_SEED_CONFIG: SeedConfig = {
  organizations: 2,
  usersPerOrg: 5,
  departmentsPerOrg: 4,
  categoriesPerOrg: 6,
  productsPerOrg: 20,
  vendorsPerOrg: 8,
  procurementRequestsPerOrg: 10,
  quotesPerRequest: 3,
  activitiesPerOrg: 30
}

export interface SeedData {
  users: User[]
  organizations: Organization[]
  departments: Department[]
  categories: Category[]
  products: Product[]
  vendors: Vendor[]
  procurementRequests: ProcurementRequest[]
  quotes: Quote[]
  activities: Activity[]
}

export type { User, Organization, Department, Category, Product, Vendor, ProcurementRequest, Quote, Activity } from '../index'