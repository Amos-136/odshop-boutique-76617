import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RoleContextType {
  role: 'admin' | 'vendor' | 'customer' | null;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  loading: boolean;
  vendorProfile: any | null;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<'admin' | 'vendor' | 'customer' | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = async () => {
    if (!user) {
      setRole(null);
      setVendorProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get user roles - using type assertion until types regenerate
      const { data: userRoles } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id) as any;

      if (userRoles && userRoles.length > 0) {
        // Priority: admin > vendor > customer
        if (userRoles.some((r: any) => r.role === 'admin')) {
          setRole('admin');
        } else if (userRoles.some((r: any) => r.role === 'vendor')) {
          setRole('vendor');
          // Get vendor profile
          const { data: vendor } = await supabase
            .from('vendors' as any)
            .select('*')
            .eq('user_id', user.id)
            .single() as any;
          setVendorProfile(vendor);
        } else {
          setRole('customer');
        }
      } else {
        setRole('customer');
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      setRole('customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isVendor = role === 'vendor';
  const isCustomer = role === 'customer';

  return (
    <RoleContext.Provider value={{ role, isAdmin, isVendor, isCustomer, loading, vendorProfile, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};