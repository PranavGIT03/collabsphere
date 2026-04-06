import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type UserRole = "student" | "faculty" | "admin";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    rollNumber?: string;
    branch?: string;
    domain?: string;
    position?: string;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchUserRole(userId: string): Promise<UserRole> {
  try {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    return (data?.role as UserRole) ?? "student";
  } catch {
    return "student";
  }
}

async function sessionToAuthUser(session: Session): Promise<AuthUser> {
  const role = await fetchUserRole(session.user.id);
  const meta = session.user.user_metadata;
  return {
    id: session.user.id,
    name: meta?.full_name ?? session.user.email ?? "",
    email: session.user.email ?? "",
    role,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session immediately
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const authUser = await sessionToAuthUser(session);
        setUser(authUser);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for subsequent auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") return; // already handled above
      if (session) {
        const authUser = await sessionToAuthUser(session);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    rollNumber?: string;
    branch?: string;
    domain?: string;
    position?: string;
  }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          role: data.role,
          roll_number: data.rollNumber ?? null,
          branch: data.branch ?? null,
          domain: data.domain ?? null,
          position: data.position ?? null,
        },
      },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
