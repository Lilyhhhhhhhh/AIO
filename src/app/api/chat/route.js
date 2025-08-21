import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, userId, okr } = await request.json();
    
    // 检查是否是询问今日任务
    if (query.toLowerCase().includes('今天') && query.toLowerCase().includes('做什么')) {
      return NextResponse.json({
        response: generateTodayTasks(okr)
      });
    }
    
    // 否则进行知识库查询
    const response = await performRAGQuery(query);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('处理聊天请求失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}

// 模拟基于OKR的任务推荐
function generateTodayTasks(okr) {
  if (!okr) {
    return '你还没有设置OKR。请先创建一个学习目标，我才能为你推荐今日任务。';
  }
  
  // 在实际实现中，这里应该将OKR传递给LLM生成任务列表
  return `基于你的学习目标"${okr.objective}"，以下是今天的推荐任务：\n\n1. 复习上周学习的内容\n2. 完成一个相关的练习题\n3. 阅读下一章节的内容`;
}

// 模拟RAG查询
async function performRAGQuery(query) {
  // 模拟知识库响应
  // 在实际实现中，这里会连接到向量数据库并使用LLM生成回答
  
  // 模拟一些预设的问答
  const knowledgeBase = {
    'b+树': 'B+树是一种树数据结构，是B树的变种，常用于数据库和文件系统中的索引。与B树不同，B+树只在叶子节点存储数据，内部节点只存储键值。所有叶子节点通过指针连接，便于范围查询。B+树的特点包括：\n\n1. 所有数据都存储在叶子节点\n2. 叶子节点形成一个有序链表\n3. 非叶子节点起到索引作用\n4. 树的高度平衡，所有叶子节点在同一层\n\n这种结构使得B+树特别适合范围查询和顺序访问，同时保持了B树对随机访问的高效性。',
    '红黑树': '红黑树是一种自平衡的二叉搜索树，每个节点都有一个额外的位来表示节点的颜色（红色或黑色）。通过在树的操作过程中保持一组特定的属性，红黑树确保没有一条路径会比其他路径长出两倍，这使得树大致上是平衡的。红黑树的特性包括：\n\n1. 每个节点要么是红色，要么是黑色\n2. 根节点是黑色的\n3. 所有叶子节点（NIL节点）都是黑色的\n4. 如果一个节点是红色的，则它的两个子节点都是黑色的\n5. 对于每个节点，从该节点到其所有后代叶子节点的简单路径上，均包含相同数目的黑色节点',
    '动态规划': '动态规划是一种通过将复杂问题分解为更简单的子问题来解决问题的方法。它适用于有重叠子问题和最优子结构的问题。动态规划的关键步骤包括：\n\n1. 定义状态：确定问题的状态表示\n2. 确定状态转移方程：描述状态之间的关系\n3. 初始化：设置初始状态的值\n4. 计算顺序：按照依赖关系计算所有状态\n5. 返回结果：从最终状态中提取答案\n\n动态规划常用于解决最短路径、背包问题、最长公共子序列等优化问题。'
  };
  
  // 简单的关键词匹配
  for (const [keyword, answer] of Object.entries(knowledgeBase)) {
    if (query.toLowerCase().includes(keyword)) {
      return answer;
    }
  }
  
  return '这是一个模拟的知识库回答。在实际实现中，这里会通过向量搜索找到相关内容，并使用LLM生成回答。我目前的知识库中没有与您问题相关的信息。';
}
