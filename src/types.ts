export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  institution?: string;
  licenseId?: string;
  city?: string;
  room?: string;
  state?: string;
  zip?: string;
  country?: string;
  mobile?: string;
  phone?: string;
  joined_date?: string;
  activeOrders?: number;
  isBanned?: boolean;
}
