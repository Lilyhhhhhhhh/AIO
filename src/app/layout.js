import '../styles/globals.css';

export const metadata = {
  title: '启明星平台',
  description: '基于OKR的学习助手',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}