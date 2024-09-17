import React, { useState, useEffect, lazy, useTransition } from 'react';
import { ChevronDown, ChevronUp, Search, ThumbsUp } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const ReactMarkdown = lazy(() => import('react-markdown'));

interface NewsItem {
  id: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  publishDate: string;
  author: string;
}

const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Simulated data fetching
    const fetchNews = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const mockNewsItems: NewsItem[] = [
        {
          id: '1',
          title: 'DSM Bot 3.0 Release',
          content: '# DSM Bot 3.0 is now available\n\nWe are excited to announce the latest version of DSM Bot...',
          views: 1200,
          likes: 150,
          publishDate: '2024-09-15',
          author: 'Rain Hu'
        },
        {
          id: '2',
          title: 'Collecting Use Cases',
          content: '## Now we are collection user use cases to build more useful assistants for specific usage...',
          views: 2200,
          likes: 500,
          publishDate: '2024-09-12',
          author: 'Rain Hu'
        },
        {
          id: '3',
          title: 'Improving Productivity with DSM Bot',
          content: '## 5 Tips to Boost Your precision\n\n1. Select specific DSM\n2. Prompt with background knowledge\n3. ...',
          views: 950,
          likes: 120,
          publishDate: '2024-09-10',
          author: 'Rain Hu'
        },
        // Add more mock data as needed
      ];

      setNewsItems(mockNewsItems);
    };

    fetchNews();
  }, []);

  const handleItemClick = (id: string) => {
    startTransition(() => {
      setExpandedItemId(id === expandedItemId ? null : id);
    });
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    startTransition(() => {
      setLikedItems(prevLikedItems => {
        const newLikedItems = new Set(prevLikedItems);
        if (newLikedItems.has(id)) {
          newLikedItems.delete(id);
        } else {
          newLikedItems.add(id);
        }
        return newLikedItems;
      });
      setNewsItems(prevItems =>
        prevItems.map(item =>
          item.id === id 
            ? { ...item, likes: item.likes + (likedItems.has(id) ? -1 : 1) } 
            : item
        )
      );
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (newsItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search news..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredNews.map((item) => (
        <Card 
          key={item.id} 
          className={`w-full transition-all duration-300 hover:shadow-lg cursor-pointer 
            ${expandedItemId === item.id ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => handleItemClick(item.id)}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-indigo-700 hover:text-indigo-900">
                {item.title}
              </span>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={likedItems.has(item.id) ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={(e) => handleLike(e, item.id)}
                  className={`transition-all duration-300 ${
                    likedItems.has(item.id) 
                      ? 'bg-indigo-500 text-white shadow-md hover:bg-indigo-600' 
                      : 'hover:bg-indigo-100'
                  }`}
                  disabled={isPending}
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                  {item.likes}
                </Button>
                {expandedItemId === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">Views: {item.views}</Badge>
              <Badge variant="secondary">Likes: {item.likes}</Badge>
              <Badge variant="secondary">Published: {item.publishDate}</Badge>
              <Badge variant="secondary">Author: {item.author}</Badge>
            </div>
          </CardHeader>
          {expandedItemId === item.id && (
            <CardContent>
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default NewsComponent;