import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Blog } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';

interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  addBlog: (title: string, content: string) => Promise<void>;
  updateBlog: (id: string, title: string, content: string) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  getBlog: (id: string) => Blog | undefined;
  refetch: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);
BlogContext.displayName = 'BlogContext';

const generateExcerpt = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
    } else {
      setBlogs(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const addBlog = useCallback(async (title: string, content: string) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        excerpt: generateExcerpt(content),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding blog:', error);
    } else if (data) {
      setBlogs(prev => [data, ...prev]);
    }
  }, []);

  const updateBlog = useCallback(async (id: string, title: string, content: string) => {
    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        excerpt: generateExcerpt(content),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog:', error);
    } else if (data) {
      setBlogs(prev =>
        prev.map(blog => (blog.id === id ? data : blog))
      );
    }
  }, []);

  const deleteBlog = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog:', error);
    } else {
      setBlogs(prev => prev.filter(blog => blog.id !== id));
    }
  }, []);

  const getBlog = useCallback((id: string) => {
    return blogs.find(blog => blog.id === id);
  }, [blogs]);

  return (
    <BlogContext.Provider value={{ blogs, loading, addBlog, updateBlog, deleteBlog, getBlog, refetch: fetchBlogs }}>
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
