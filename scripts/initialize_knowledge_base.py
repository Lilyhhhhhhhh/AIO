"""
知识库初始化脚本

这个脚本用于读取PDF或Markdown文件，将其切片并向量化，然后存入Supabase的pgvector数据库中。
这是一个一次性的脚本，用于初始化知识库。

使用方法:
1. 安装依赖: pip install openai supabase langchain pypdf markdown
2. 设置环境变量:
   - SUPABASE_URL: Supabase项目URL
   - SUPABASE_KEY: Supabase服务角色密钥
   - OPENAI_API_KEY: OpenAI API密钥
3. 运行脚本: python initialize_knowledge_base.py
"""

import os
import sys
from langchain.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from supabase import create_client, Client
import glob

# 配置
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
EMBEDDING_MODEL = "text-embedding-ada-002"  # OpenAI嵌入模型

# 从环境变量获取配置
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
openai_api_key = os.environ.get("OPENAI_API_KEY")

# 检查环境变量
if not all([supabase_url, supabase_key, openai_api_key]):
    print("错误: 请设置所有必要的环境变量")
    sys.exit(1)

# 初始化Supabase客户端
supabase: Client = create_client(supabase_url, supabase_key)

# 初始化OpenAI嵌入
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

# 文本分割器
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
    length_function=len,
)

def process_file(file_path):
    """处理单个文件，返回文档块列表"""
    print(f"处理文件: {file_path}")
    
    if file_path.lower().endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    elif file_path.lower().endswith('.md'):
        loader = TextLoader(file_path)
    else:
        print(f"不支持的文件类型: {file_path}")
        return []
    
    documents = loader.load()
    chunks = text_splitter.split_documents(documents)
    
    print(f"从 {file_path} 提取了 {len(chunks)} 个文本块")
    return chunks

def embed_and_store(chunks):
    """为文本块生成嵌入向量并存储到Supabase"""
    print(f"开始为 {len(chunks)} 个文本块生成嵌入向量...")
    
    for i, chunk in enumerate(chunks):
        content = chunk.page_content
        embedding = embeddings.embed_query(content)
        
        # 存储到Supabase
        supabase.table("knowledge_chunks").insert({
            "content": content,
            "embedding": embedding
        }).execute()
        
        if (i + 1) % 10 == 0:
            print(f"已处理 {i + 1}/{len(chunks)} 个文本块")
    
    print("所有文本块已成功存储到数据库")

def main():
    # 知识库文件目录
    knowledge_dir = "knowledge"
    
    # 检查目录是否存在
    if not os.path.exists(knowledge_dir):
        os.makedirs(knowledge_dir)
        print(f"已创建知识库目录: {knowledge_dir}")
        print("请将PDF或Markdown文件放入该目录，然后重新运行此脚本")
        return
    
    # 获取所有PDF和Markdown文件
    pdf_files = glob.glob(os.path.join(knowledge_dir, "*.pdf"))
    md_files = glob.glob(os.path.join(knowledge_dir, "*.md"))
    all_files = pdf_files + md_files
    
    if not all_files:
        print(f"在 {knowledge_dir} 目录中未找到PDF或Markdown文件")
        return
    
    print(f"找到 {len(all_files)} 个文件待处理")
    
    # 处理所有文件
    all_chunks = []
    for file_path in all_files:
        chunks = process_file(file_path)
        all_chunks.extend(chunks)
    
    # 生成嵌入向量并存储
    if all_chunks:
        embed_and_store(all_chunks)
        print("知识库初始化完成!")
    else:
        print("未从文件中提取到任何内容")

if __name__ == "__main__":
    main()