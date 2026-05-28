import { supabase } from '@/lib/supabase/client';

const LOCAL_USER_KEY = 'vexaro.local-user-id';

export async function getCurrentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (data.user?.id) {
    return data.user.id;
  }

  const stored = window.localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    return stored;
  }

  const generated = crypto.randomUUID();
  window.localStorage.setItem(LOCAL_USER_KEY, generated);
  return generated;
}
