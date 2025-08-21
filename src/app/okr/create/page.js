'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateOKR() {
  const router = useRouter();
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleKeyResultChange = (index, value) => {
    const newKeyResults = [...keyResults];
    newKeyResults[index] = value;
    setKeyResults(newKeyResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 在实际应用中，这里会将OKR保存到Supabase
      // 现在我们只是模拟保存过程
      
      if (!objective.trim()) {
        throw new Error('请输入目标');
      }

      // 过滤掉空的关键结果
      const filteredKeyResults = keyResults.filter(kr => kr.trim() !== '').map(text => ({ text }));

      if (filteredKeyResults.length === 0) {
        throw new Error('请至少输入一个关键结果');
      }

      // 模拟保存成功
      setTimeout(() => {
        // 创建成功，返回主页
        alert('OKR创建成功！');
        router.push('/');
      }, 1000);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">创建我的OKR</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="objective">
              目标 (Objective)
            </label>
            <textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="例如：掌握数据结构与算法的核心概念"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              关键结果 (Key Results)
            </label>
            <p className="text-sm text-gray-600 mb-2">最多可添加3个关键结果</p>
            
            {keyResults.map((kr, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-sm mb-1" htmlFor={`kr-${index}`}>
                  关键结果 {index + 1}
                </label>
                <textarea
                  id={`kr-${index}`}
                  value={kr}
                  onChange={(e) => handleKeyResultChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="2"
                  placeholder={`例如：完成《数据结构》课程的所有章节学习`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => router.push('/')}
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading || !objective.trim()}
            >
              {loading ? '保存中...' : '保存OKR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
