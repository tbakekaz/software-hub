import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 从路径中提取语言代码
  let lang = 'zh'; // 默认语言
  if (pathname.startsWith('/kk') || pathname.startsWith('/kk/')) {
    lang = 'kk';
  } else if (pathname.startsWith('/ru') || pathname.startsWith('/ru/')) {
    lang = 'ru';
  } else if (pathname.startsWith('/en') || pathname.startsWith('/en/')) {
    lang = 'en';
  } else if (pathname.startsWith('/zh') || pathname.startsWith('/zh/')) {
    lang = 'zh';
  } else {
    // 如果路径不是语言路径，尝试从 cookie 读取
    const cookieLang = request.cookies.get('lang')?.value;
    if (cookieLang === 'zh' || cookieLang === 'kk' || cookieLang === 'ru' || cookieLang === 'en') {
      lang = cookieLang;
    }
  }
  
  // 创建响应
  const response = NextResponse.next();
  
  // 设置语言 cookie
  response.cookies.set('lang', lang, {
    path: '/',
    maxAge: 31536000, // 1年
    sameSite: 'lax',
  });
  
  // 在响应头中添加语言信息（用于调试）
  response.headers.set('x-lang', lang);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

