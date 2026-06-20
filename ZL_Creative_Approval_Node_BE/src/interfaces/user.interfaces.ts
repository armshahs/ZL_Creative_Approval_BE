export interface User {
  id: string;
  email: string;
  name: string;
  status: string;
  isSuperadmin: boolean;
  mfaEnabled: boolean;
}
