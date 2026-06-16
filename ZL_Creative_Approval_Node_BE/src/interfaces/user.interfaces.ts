import { RoleType } from "../config";

// Define user type based on expected structure from AuthService
export interface User {
  id: string;
  email: string;
  // Add other user fields here based on your database model or JWT payload
  role: RoleType;
}
