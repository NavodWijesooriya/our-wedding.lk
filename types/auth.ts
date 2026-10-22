export type UserRole = 'admin' | 'user';

export type UserApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  status: UserApprovalStatus;
  createdAt?: string;
  updatedAt?: string;
  rejectionReason?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
}
