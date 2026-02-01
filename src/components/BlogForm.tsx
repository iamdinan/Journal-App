import { useState, useEffect } from 'react';
import { Blog } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BlogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog?: Blog | null;
  onSubmit: (title: string, content: string) => void;
}

const BlogForm = ({ open, onOpenChange, blog, onSubmit }: BlogFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [blog, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {blog ? 'Edit Post' : 'New Post'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-serif border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none border-0 px-0 focus-visible:ring-0 text-foreground/90 leading-relaxed"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              {blog ? 'Update' : 'Publish'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;
