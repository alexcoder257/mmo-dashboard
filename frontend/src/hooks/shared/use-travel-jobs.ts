import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/libs/firebase/config';

export interface ITravelJob {
  createdAt: Date | null;
  error: null | string;
  id: string;
  notionUrl: null | string;
  status: 'analyzing' | 'completed' | 'creating_notion' | 'downloading' | 'extracting_frames' | 'failed' | 'uploading_images';
  tiktokUrl: string;
  title: string;
  updatedAt: Date | null;
  videoFilename: null | string;
}

export function useTravelJobs() {
  const [jobs, setJobs] = useState<ITravelJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'travel_jobs'),
      orderBy('created_at', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedJobs = snapshot.docs.map((doc) =>
        docToJob(doc.id, doc.data()),
      );
      setJobs(updatedJobs);
      setLoading(false);
    }, (error) => {
      console.error('Firestore travel_jobs listener error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { jobs, loading };
}

function docToJob(id: string, data: Record<string, unknown>): ITravelJob {
  return {
    createdAt: data.created_at && typeof data.created_at === 'object' && 'toDate' in data.created_at
      ? (data.created_at as { toDate: () => Date }).toDate()
      : null,
    error: (data.error as string) || null,
    id,
    notionUrl: (data.notion_url as string) || null,
    status: (data.status as ITravelJob['status']) || 'downloading',
    tiktokUrl: (data.tiktok_url as string) || '',
    title: (data.title as string) || '',
    updatedAt: data.updated_at && typeof data.updated_at === 'object' && 'toDate' in data.updated_at
      ? (data.updated_at as { toDate: () => Date }).toDate()
      : null,
    videoFilename: (data.video_filename as string) || null,
  };
}
