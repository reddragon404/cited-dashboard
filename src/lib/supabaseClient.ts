// Mock Supabase client for demo purposes
// This allows the app to run without Supabase configuration

export const createSupabaseClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null })
    }
  } as {
    auth: {
      getUser: () => Promise<{ data: { user: null }; error: null }>;
      signOut: () => Promise<{ error: null }>;
    };
  }
}

// For client-side usage
export const supabase = createSupabaseClient()