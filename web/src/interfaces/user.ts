export interface User {
  id: string;
  name: string;
  email: string;
  status: 'suspended' | 'active' | 'inactive';
  role: 'admin' | 'user';
  organization?: string;
}
