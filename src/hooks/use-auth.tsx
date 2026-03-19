import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  roles: string[]
  isActive: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

const updatedSessions = new Set<string>()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [isActive, setIsActive] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (userId: string) => {
    const [rolesRes, profileRes] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId).eq('is_active', true),
      supabase.from('profiles').select('is_active').eq('id', userId).single(),
    ])

    if (rolesRes.data) setRoles(rolesRes.data.map((r) => r.role))

    const active = profileRes.data?.is_active ?? false
    setIsActive(active)

    if (active && !updatedSessions.has(userId)) {
      updatedSessions.add(userId)
      supabase
        .from('profiles')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('id', userId)
        .then()
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.id).finally(() => setLoading(false))
      } else {
        setRoles([])
        setIsActive(false)
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    updatedSessions.clear()
    return { error }
  }

  const hasRole = (role: string) => roles.includes(role) || roles.includes('admin')

  return (
    <AuthContext.Provider
      value={{ user, session, roles, isActive, signIn, signUp, signOut, loading, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  )
}
