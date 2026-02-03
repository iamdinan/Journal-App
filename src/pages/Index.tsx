import { useState, useEffect, useMemo } from 'react';
import { Blog } from '@/types/blog';
import { useBlog } from '@/context/BlogContext';
import { useWallpaper } from '@/context/WallpaperContext';
import BlogCard from '@/components/BlogCard';
import BlogForm from '@/components/BlogForm';
import BlogDetail from '@/components/BlogDetail';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import ThemeToggle from '@/components/ThemeToggle';
import WallpaperToggle from '@/components/WallpaperToggle';
import QuoteCard from '@/components/QuoteCard';
import SortFilter, { SortOrder } from '@/components/SortFilter';
import { Button } from '@/components/ui/button';
import { Plus, PenLine } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const POSTS_PER_PAGE = 5;

const Index = () => {
  const { blogs, loading, addBlog, updateBlog, deleteBlog } = useBlog();
  const { wallpaperEnabled, currentWallpaper, refreshWallpaper } = useWallpaper();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Refresh wallpaper when page changes
  useEffect(() => {
    refreshWallpaper();
  }, [currentPage]);

  // Sort and paginate blogs
  const sortedBlogs = useMemo(() => {
    const sorted = [...blogs].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [blogs, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentBlogs = sortedBlogs.slice(startIndex, endIndex);

  // Wallpaper background style
  const wallpaperStyle = wallpaperEnabled
    ? {
        backgroundImage: `linear-gradient(to bottom, hsl(var(--background) / 0.7), hsl(var(--background) / 0.8)), url(${currentWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    : {};

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

  const confirmDelete = async () => {
    if (blogToDelete) {
      await deleteBlog(blogToDelete.id);
      if (selectedBlog?.id === blogToDelete.id) {
        setSelectedBlog(null);
      }
      setBlogToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (title: string, content: string) => {
    if (editingBlog) {
      await updateBlog(editingBlog.id, title, content);
      if (selectedBlog?.id === editingBlog.id) {
        setSelectedBlog({ ...editingBlog, title, content });
      }
    } else {
      await addBlog(title, content);
    }
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-background transition-all duration-500" style={wallpaperStyle}>
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
    <div className="min-h-screen bg-background transition-all duration-500" style={wallpaperStyle}>
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
          <div className="flex items-center gap-2">
            <WallpaperToggle />
            <ThemeToggle />
            <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Post</span>
            </Button>
          </div>
        </header>

        {/* Quote Card */}
        <QuoteCard />

        {/* Filter and Blog List */}
        {blogs.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <SortFilter value={sortOrder} onChange={setSortOrder} />
            </div>
            {currentBlogs.map((blog, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
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
