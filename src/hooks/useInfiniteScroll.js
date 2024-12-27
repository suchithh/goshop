import { useCallback, useRef, useState } from 'react';

export const useInfiniteScroll = (loadMore, hasMore, loading) => {
  const observer = useRef();
  
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  return lastElementRef;
};