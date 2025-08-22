import { NextResponse } from 'next/server';

export function middleware(request) {
  // 获取当前路径
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // 如果用户访问的是根路径，我们检查cookie中是否有标记表示用户已经查看过欢迎页
  if (pathname === '/') {
    // 检查cookie中是否有标记
    const hasVisitedWelcomePage = request.cookies.get('hasVisitedWelcomePage');
    
    // 如果没有查看过欢迎页，重定向到欢迎页
    if (!hasVisitedWelcomePage) {
      url.pathname = '/welcome';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/', '/welcome'],
};