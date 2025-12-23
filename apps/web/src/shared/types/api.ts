// Shared API types for frontend
export interface ProcurementRequest {
  id: string;
  title: string;
  status: string;
  items: any[];
  orgId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  orgId: string;
}

export interface Quote {
  id: string;
  requestId: string;
  vendorId: string;
  unitPrice: number;
  totalPrice: number;
  deliveryETA?: number;
  terms?: any;
  createdAt: string;
}

export interface CreateRequestPayload {
  title: string;
  items: Array<{
    name: string;
    quantity: number;
    specifications: string;
  }>;
  orgId: string;
  created_by: string;
}

export interface SendRFQPayload {
  vendors: string[]; // vendor IDs
}
