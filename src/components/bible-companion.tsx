"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { bibleBooks } from '@/lib/bible-data';
import { getChapterExplanation } from '@/app/actions';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export function BibleCompanion() {
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedBook = localStorage.getItem('selectedBook');
      if (savedBook) {
        const savedChapter = localStorage.getItem('selectedChapter');
        setSelectedBook(savedBook);
        if (savedChapter) {
          setSelectedChapter(savedChapter);
        }
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
  }, []);

  const chapters = useMemo(() => {
    const bookData = bibleBooks.find(b => b.name === selectedBook);
    return bookData ? Array.from({ length: bookData.chapters }, (_, i) => i + 1) : [];
  }, [selectedBook]);

  const fetchExplanation = useCallback(async (book: string, chapter: string) => {
    if (!book || !chapter) return;

    setIsLoading(true);
    setExplanation('');

    try {
      const response = await getChapterExplanation({
        book: book,
        chapter: parseInt(chapter, 10),
      });

      if (response.success && response.data) {
        setExplanation(response.data.explanation);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while fetching the explanation.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted && selectedBook && selectedChapter && hasUserSelected) {
      fetchExplanation(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter, isMounted, fetchExplanation, hasUserSelected]);

  const handleBookChange = (bookName: string) => {
    setSelectedBook(bookName);
    const firstChapter = '1';
    setSelectedChapter(firstChapter);
    setExplanation('');
    try {
      localStorage.setItem('selectedBook', bookName);
      localStorage.setItem('selectedChapter', firstChapter);
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
    setHasUserSelected(false);
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(chapter);
    setHasUserSelected(true);
    try {
      localStorage.setItem('selectedChapter', chapter);
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
  };
  
  const handleReset = () => {
    setSelectedBook('');
    setSelectedChapter('');
    setExplanation('');
    setHasUserSelected(false);
    try {
      localStorage.removeItem('selectedBook');
      localStorage.removeItem('selectedChapter');
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
  };

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Start Your Study</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedExplanation = explanation.replace(/\n/g, '<br />');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Start Your Study</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="book-select">Choose a Book of the Bible</Label>
              <Select onValueChange={handleBookChange} value={selectedBook}>
                <SelectTrigger id="book-select" className="w-full">
                  <SelectValue placeholder="Select a book..." />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper">
                  <ScrollArea className="h-72">
                    {bibleBooks.map(book => (
                      <SelectItem key={book.name} value={book.name}>{book.name}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapter-select">Choose a Chapter</Label>
              <Select onValueChange={handleChapterChange} value={selectedChapter} disabled={!selectedBook}>
                <SelectTrigger id="chapter-select" className="w-full">
                  <SelectValue placeholder="Select a chapter..." />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper">
                  <ScrollArea className="h-72">
                    {chapters.map(chapter => (
                      <SelectItem key={chapter} value={chapter.toString()}>{`Chapter ${chapter}`}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-body">Studying this chapter...</p>
        </Card>
      )}

      {explanation && !isLoading && (
        <Card className="animate-in fade-in-0 duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{selectedBook} {selectedChapter}</CardTitle>
          </CardHeader>
          <CardContent>
             <ScrollArea className="h-[40vh] md:h-auto">
              <div 
                className="text-base font-body text-foreground/90 leading-relaxed pr-4"
                dangerouslySetInnerHTML={{ __html: formattedExplanation }}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
