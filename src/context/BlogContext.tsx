import React, { createContext, useContext, useState, useCallback } from 'react';
import { Blog } from '@/types/blog';

interface BlogContextType {
  blogs: Blog[];
  addBlog: (title: string, content: string) => void;
  updateBlog: (id: string, title: string, content: string) => void;
  deleteBlog: (id: string) => void;
  getBlog: (id: string) => Blog | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);
BlogContext.displayName = 'BlogContext';

const generateExcerpt = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

const initialBlogs: Blog[] = [
  {
    id: '1',
    title: 'The Art of Minimalism',
    content: 'Minimalism is not about having less. It\'s about making room for more of what matters. In a world cluttered with noise and distractions, choosing simplicity becomes an act of rebellion. When we strip away the unnecessary, we discover what truly brings us joy and purpose.\n\nThe journey toward minimalism begins with a single question: Does this add value to my life? This simple inquiry, applied consistently, transforms not just our physical spaces but our mental landscapes as well.',
    excerpt: 'Minimalism is not about having less. It\'s about making room for more of what matters. In a world cluttered with noise and distractions...',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Finding Stillness in Motion',
    content: 'There is a peculiar peace that comes from moving through the world with intention. Whether walking through a quiet forest or navigating a busy street, stillness is something we carry within us.\n\nThe ancient philosophers understood this well. They knew that external chaos need not disturb our inner calm. The practice of finding stillness in motion is perhaps the most practical form of meditation available to modern life.',
    excerpt: 'There is a peculiar peace that comes from moving through the world with intention. Whether walking through a quiet forest or navigating...',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'On the Beauty of Imperfection',
    content: 'The Japanese concept of wabi-sabi teaches us to find beauty in imperfection. A cracked vase, weathered wood, the asymmetry of handmade objects—these imperfections tell stories that perfection never could.\n\nIn our pursuit of flawlessness, we often forget that it is our rough edges that make us interesting. Our scars, our mistakes, our peculiarities—these are not flaws to hide but features to embrace.',
    excerpt: 'The Japanese concept of wabi-sabi teaches us to find beauty in imperfection. A cracked vase, weathered wood, the asymmetry of...',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
  },
];

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);

  const addBlog = useCallback((title: string, content: string) => {
    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: generateExcerpt(content),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBlogs(prev => [newBlog, ...prev]);
  }, []);

  const updateBlog = useCallback((id: string, title: string, content: string) => {
    setBlogs(prev =>
      prev.map(blog =>
        blog.id === id
          ? { ...blog, title, content, excerpt: generateExcerpt(content), updatedAt: new Date() }
          : blog
      )
    );
  }, []);

  const deleteBlog = useCallback((id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  }, []);

  const getBlog = useCallback((id: string) => {
    return blogs.find(blog => blog.id === id);
  }, [blogs]);

  return (
    <BlogContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog, getBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
