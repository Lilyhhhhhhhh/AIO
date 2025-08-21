// 模拟Supabase客户端
// 在实际实现中，这里会使用@supabase/supabase-js创建真实的客户端

export const supabase = {
  auth: {
    getSession: async () => {
      // 模拟获取会话
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        return { data: { session: { user: JSON.parse(storedUser) } } };
      }
      return { data: { session: null } };
    },
    signInWithPassword: async ({ email, password }) => {
      // 模拟登录
      if (email && password) {
        const mockUser = { id: '123', email };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return { error: null };
      }
      return { error: { message: '邮箱或密码错误' } };
    },
    signUp: async ({ email, password }) => {
      // 模拟注册
      if (email && password) {
        return { error: null };
      }
      return { error: { message: '注册失败' } };
    },
    signOut: async () => {
      // 模拟登出
      localStorage.removeItem('mockUser');
      return { error: null };
    }
  },
  from: (table) => {
    return {
      select: () => {
        return {
          eq: () => {
            return {
              order: () => {
                return {
                  limit: () => {
                    // 模拟OKR数据
                    if (table === 'okrs') {
                      return { 
                        data: [{ 
                          id: '1', 
                          objective: '掌握数据结构与算法的核心概念', 
                          key_results: [
                            { text: '完成《数据结构》课程的所有章节学习' },
                            { text: '解决50道算法题' },
                            { text: '实现3个数据结构的实际应用' }
                          ]
                        }], 
                        error: null 
                      };
                    }
                    // 模拟聊天历史
                    if (table === 'chat_history') {
                      return { data: [], error: null };
                    }
                    return { data: [], error: null };
                  }
                };
              }
            };
          }
        };
      },
      insert: () => {
        return {
          execute: async () => {
            return { error: null };
          }
        };
      }
    };
  }
};
