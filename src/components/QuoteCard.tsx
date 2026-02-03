import { useState, useCallback } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRandomQuote } from '@/data/quotes';

const QuoteCard = () => {
  const [quote, setQuote] = useState(getRandomQuote);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshQuote = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsRefreshing(false);
    }, 300);
  }, []);

  return (
    <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 mb-8">
      <Quote className="absolute top-4 left-4 h-6 w-6 text-primary/20" />
      <div className="pl-8 pr-10">
        <p className={`text-foreground/80 italic leading-relaxed transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
          "{quote.text}"
        </p>
        <p className={`mt-2 text-sm text-muted-foreground transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
          — {quote.author}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={refreshQuote}
      >
        <RefreshCw className={`h-4 w-4 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default QuoteCard;
