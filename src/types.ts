export interface User {
  id: string;
  name: string;
  role: string;
  status: boolean;
  email: string;
  profilePhoto?: string;
}
export interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: boolean;
  profilePhoto: string;
}
