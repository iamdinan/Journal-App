import { Blog } from '@/types/blog';
import { format } from 'date-fns';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

const BlogDetail = ({ blog, onBack, onEdit, onDelete }: BlogDetailProps) => {
  return (
    <article className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(blog)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(blog)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <header className="mb-8">
        <time className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {format(blog.createdAt, 'MMMM d, yyyy · h:mm a')}
          {blog.updatedAt > blog.createdAt && (
            <span className="ml-2 normal-case text-xs">
              (Updated: {format(blog.updatedAt, 'MMM d, yyyy · h:mm a')})
            </span>
          )}
        </time>
        <h1 className="mt-3 font-serif text-4xl font-bold text-foreground leading-tight">
          {blog.title}
        </h1>
      </header>

      <div className="prose prose-lg">
        {blog.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-foreground/85 leading-relaxed mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};

export default BlogDetail;
