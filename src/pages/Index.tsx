import { useState } from 'react';
import { Blog } from '@/types/blog';
import { useBlog } from '@/context/BlogContext';
import BlogCard from '@/components/BlogCard';
import BlogForm from '@/components/BlogForm';
import BlogDetail from '@/components/BlogDetail';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus, PenLine } from 'lucide-react';

const Index = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlog();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const handleAddNew = () => {
    setEditingBlog(null);
    setFormOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormOpen(true);
  };

  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteBlog(blogToDelete.id);
      if (selectedBlog?.id === blogToDelete.id) {
        setSelectedBlog(null);
      }
      setBlogToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleFormSubmit = (title: string, content: string) => {
    if (editingBlog) {
      updateBlog(editingBlog.id, title, content);
      if (selectedBlog?.id === editingBlog.id) {
        setSelectedBlog({ ...editingBlog, title, content });
      }
    } else {
      addBlog(title, content);
    }
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12 px-4 sm:px-6">
          <BlogDetail
            blog={selectedBlog}
            onBack={() => setSelectedBlog(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <BlogForm
          open={formOpen}
          onOpenChange={setFormOpen}
          blog={editingBlog}
          onSubmit={handleFormSubmit}
        />
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title={blogToDelete?.title || ''}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 px-4 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Journal
            </h1>
            <p className="mt-1 text-muted-foreground">
              Thoughts, stories, and ideas
            </p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </header>

        {/* Blog List */}
        {blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BlogCard
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={handleBlogClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PenLine className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 font-serif text-xl text-foreground">No posts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Start writing your first post
            </p>
            <Button onClick={handleAddNew} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <BlogForm
        open={formOpen}
        onOpenChange={setFormOpen}
        blog={editingBlog}
        onSubmit={handleFormSubmit}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={blogToDelete?.title || ''}
      />
    </div>
  );
};

export default Index;
