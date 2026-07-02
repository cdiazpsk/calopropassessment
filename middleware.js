import {NextResponse} from 'next/server';
export function middleware(request){const{pathname}=request.nextUrl;if(pathname.startsWith('/admin')&&pathname!=='/admin/login'){const ok=request.cookies.get('caliber_admin_auth')?.value==='true';if(!ok){const url=new URL('/admin/login',request.url);url.searchParams.set('next',pathname);return NextResponse.redirect(url)}}return NextResponse.next()}
export const config={matcher:['/admin/:path*']};
