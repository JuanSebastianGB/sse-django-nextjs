import { useCallback, useEffect, useState } from 'react';

const SSE_URL = 'http://localhost:8000/mstream';

const LIMIT_COUNT = 5;

export const useSse = () => {
  const [counter, setCounter] = useState(0);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({} as any);

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

        setCurrentEvent({ start, description, frequency });
        //@ts-ignore
        setEvents((prevEvents) => [
          ...prevEvents,
          { start, description, frequency },
        ]);
        return newCounter;
      });
    };
    setEventSource(es);
  }, [eventSource]);

  const stopSSE = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  }, [eventSource]);

  useEffect(() => {
    startSSE();
    return () => {
      stopSSE();
    };
  }, [startSSE, stopSSE]);

  return {
    counter,
    events,
    currentEvent,
    eventSource,
    startSSE,
    stopSSE,
  };
};
