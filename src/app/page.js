'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [okr, setOkr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否已查看过欢迎页
    const hasVisitedWelcomePage = localStorage.getItem('hasVisitedWelcomePage');
    
    // 如果用户没有查看过欢迎页，则重定向到欢迎页
    if (!hasVisitedWelcomePage && typeof window !== 'undefined') {
      router.push('/welcome');
      return;
    }
    
    // 检查用户是否已登录
    const checkUser = async () => {
      try {
        // 在实际应用中，这里会从Supabase获取会话
        // 现在我们模拟一个已登录的用户
        const mockUser = { id: '123', email: 'user@example.com' };
        setUser(mockUser);
        
        // 模拟加载OKR
        const mockOkr = {
          id: '1',
          objective: '掌握数据结构与算法的核心概念',
          key_results: [
            { text: '完成《数据结构》课程的所有章节学习' },
            { text: '解决50道算法题' },
            { text: '实现3个数据结构的实际应用' }
          ]
        };
        setOkr(mockOkr);
      } catch (error) {
        console.error('检查用户状态失败:', error);
        // 如果出错，重定向到登录页
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  // 处理登出
  const handleLogout = () => {
    // 在实际应用中，这里会调用Supabase的登出方法
    // 现在我们只是重定向到登录页
    router.push('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">启明星平台</h1>
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            退出登录
          </button>
        </div>
      </nav>
      
      {/* 主内容区 */}
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
            {/* 左侧OKR区域 */}
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow flex flex-col">
              <h2 className="text-xl font-semibold mb-4">我的OKR</h2>
              
              {okr ? (
                <div className="flex-grow">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700">目标 (O):</h3>
                    <p className="mt-1 text-gray-900">{okr.objective}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">关键结果 (KR):</h3>
                    <ul className="mt-1 list-disc list-inside">
                      {okr.key_results.map((kr, index) => (
                        <li key={index} className="text-gray-900 mt-1">{kr.text}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => router.push('/okr/create')}
                  >
                    更新OKR
                  </button>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <p className="text-gray-500 mb-4">你还没有创建OKR</p>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => router.push('/okr/create')}
                  >
                    创建OKR
                  </button>
                </div>
              )}
            </div>
            
            {/* 右侧聊天区域 */}
            <div className="md:col-span-2 bg-white p-4 rounded-lg shadow flex flex-col">
              <h2 className="text-xl font-semibold mb-4">AI助手</h2>
              <div className="flex-grow">
                {user && <ChatInterface user={user} okr={okr} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
