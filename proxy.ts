import middleware from 'next-auth/middleware';

export const proxy = middleware;

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/orders/:path*', '/admin/customers/:path*', '/admin/services/:path*', '/admin/settings/:path*', '/api/admin/:path*'],
};
