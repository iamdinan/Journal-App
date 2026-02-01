import { Blog } from '@/types/blog';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onClick: (blog: Blog) => void;
}

const BlogCard = ({ blog, onEdit, onDelete, onClick }: BlogCardProps) => {
  return (
    <article 
      className="group relative bg-card rounded-lg p-6 transition-all duration-300 hover:shadow-card cursor-pointer border border-border/50"
      onClick={() => onClick(blog)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <time className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {format(blog.createdAt, 'MMMM d, yyyy')}
          </time>
          <h2 className="mt-2 font-serif text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
            {blog.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(blog)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(blog)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
