'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Welcome() {
  const router = useRouter();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // 页面加载动画效果
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 处理"开始使用"按钮点击
  const handleStart = () => {
    // 设置本地存储标记，表示用户已查看过封面页
    localStorage.setItem('hasVisitedWelcomePage', 'true');
    
    // 设置cookie，用于服务端判断
    document.cookie = 'hasVisitedWelcomePage=true; path=/; max-age=31536000'; // 一年有效期
    
    // 跳转到登录页
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 顶部区域 */}
      <header className={`pt-10 px-4 text-center transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800">启明星平台</h1>
        <p className="mt-3 text-xl text-gray-700">AI驱动的学习目标管理与知识助手</p>
      </header>

      {/* 中央主视觉区域 */}
      <main className={`flex-grow flex flex-col items-center justify-center px-4 py-8 transition-all duration-700 ${animationComplete ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
        <div className="w-full max-w-6xl">
          {/* 主视觉图像区域 */}
          <div className="relative h-64 md:h-80 mb-12 flex items-center justify-center">
            {/* 这里可以放置主视觉图像，现在用简单的SVG图形代替 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-around">
                {/* 左侧：学生形象 */}
                <div className="flex flex-col items-center mb-6 md:mb-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl mb-4">
                    👨‍🎓
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-blue-800">学生</h3>
                    <p className="text-sm text-gray-600">设定学习目标</p>
                  </div>
                </div>

                {/* 中间：连接线 */}
                <div className="hidden md:block w-32 h-1 bg-gradient-to-r from-blue-400 to-green-400"></div>

                {/* 右侧：AI助手形象 */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-green-600 rounded-full flex items-center justify-center text-white text-5xl mb-4">
                    🤖
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-green-800">AI助手</h3>
                    <p className="text-sm text-gray-600">提供智能学习支持</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 功能展示区 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* 功能1：用户认证 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">用户认证</h3>
              <p className="text-gray-600 text-sm">学生可以通过邮箱和密码进行注册、登录、登出</p>
            </div>

            {/* 功能2：OKR管理 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">OKR管理</h3>
              <p className="text-gray-600 text-sm">学生可以创建和查看自己的学习目标和关键结果</p>
            </div>

            {/* 功能3：AI知识库问答 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">AI知识库问答</h3>
              <p className="text-gray-600 text-sm">基于预置知识库的问答功能</p>
            </div>

            {/* 功能4：基于OKR的任务推荐 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">任务推荐</h3>
              <p className="text-gray-600 text-sm">AI助手能根据学生的OKR推荐每日任务</p>
            </div>
          </div>
        </div>
      </main>

      {/* 底部行动区 */}
      <footer className={`pb-10 px-4 text-center transition-opacity duration-700 delay-300 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-gray-700 mb-6">开启你的智能学习之旅，设定目标，实现成长</p>
        <button
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          开始使用
        </button>
      </footer>
    </div>
  );
}