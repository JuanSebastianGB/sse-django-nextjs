import { useCallback, useEffect, useState } from 'react';

const SSE_URL = 'http://localhost:8000/mstream';

import { useToast } from '@/components/ui/use-toast';

const LIMIT_COUNT = 5;

export const useSse = () => {
  const [counter, setCounter] = useState(0);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [events, setEvents] = useState([]);
  const { toast: toastCN } = useToast();

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const startSSE = useCallback(() => {
    if (eventSource) return;
    const es = new EventSource(SSE_URL);
    es.onmessage = (event) => {
      const { start, description, frequency } = JSON.parse(event.data);
      setCounter((prevCounter) => {
        const newCounter = prevCounter + 1;
        if (newCounter === LIMIT_COUNT) {
          setEvents([]);
          return 0;
        }
        // notify();
        toastCN({
          title: 'Event Received',
          description: start,
        });
        //@ts-ignore
        setEvents((prevEvents) => [
          ...prevEvents,
          { start, description, frequency },
        ]);
        return newCounter;
      });
    };
    setEventSource(es);
  }, []);

  const stopSSE = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  }, [eventSource]);

  return {
    counter,
    events,
    eventSource,
    startSSE,
    stopSSE,
  };
};
