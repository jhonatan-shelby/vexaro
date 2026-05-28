import { supabase } from '@/lib/supabase/client';

export class AuthService {
  static async signInWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    return { data, error };
  }

  static async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }
}
