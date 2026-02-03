import { Blog } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onClick: (blog: Blog) => void;
}

const BlogCard = ({ blog, onEdit, onDelete, onClick }: BlogCardProps) => {
  const createdDate = typeof blog.created_at === 'string' ? parseISO(blog.created_at) : new Date(blog.created_at);

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/20 bg-card/80 backdrop-blur-sm"
      onClick={() => onClick(blog)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {blog.title}
          </h2>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(blog);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(blog);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <time className="text-sm text-muted-foreground">
          {format(createdDate, 'MMMM d, yyyy · h:mm a')}
        </time>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{blog.excerpt}</p>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
