import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/checkout', '/obrigado', '/terms', '/privacy']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/checkout/')
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticAsset = pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')

  // Allow public routes, API routes, and static assets
  if (isPublicRoute || isApiRoute || isStaticAsset) {
    return supabaseResponse
  }

  // Protected routes under /app
  if (pathname.startsWith('/app')) {
    // Not logged in -> redirect to login
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Fetch profile and entitlements in a single query batch
    const [profileResult, entitlementsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single(),
      supabase
        .from('entitlements')
        .select('status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
    ])

    const profile = profileResult.data
    const entitlements = entitlementsResult.data
    const isAdmin = profile?.role === 'admin'

    // Check for admin routes
    if (pathname.startsWith('/app/admin')) {
      if (!isAdmin) {
        // Not admin -> redirect to dashboard
        return NextResponse.redirect(new URL('/app', request.url))
      }
      // Admin can access admin routes
      return supabaseResponse
    }

    // For non-admin member routes, check entitlement
    const hasValidEntitlement = entitlements && entitlements.some(e =>
      !e.expires_at || new Date(e.expires_at) > new Date()
    )

    // Admins bypass entitlement check
    if (isAdmin) {
      return supabaseResponse
    }

    // If no valid entitlement, allow only specific routes
    const allowedWithoutEntitlement = ['/app', '/app/conta', '/app/suporte']
    if (!hasValidEntitlement && !allowedWithoutEntitlement.includes(pathname)) {
      return NextResponse.redirect(new URL('/checkout', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
