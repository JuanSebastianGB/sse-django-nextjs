'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from '@/components/ui/button';

const LIMIT_COUNT = 15;

export const CustomComponent = () => {
  const [counter, setCounter] = useState(0);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [events, setEvents] = useState([]);

  const notify = () => toast('Wow so easy!');

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const startSSE = useCallback(() => {
    if (eventSource) return;
    const es = new EventSource('http://localhost:8000/mstream');
    es.onmessage = (event) => {
      const { start, description, frequency } = JSON.parse(event.data);
      setCounter((prevCounter) => {
        const newCounter = prevCounter + 1;
        if (newCounter === LIMIT_COUNT) {
          setEvents([]);
          return 0;
        }
        notify();
        //@ts-ignore
        setEvents((prevEvents) => [...prevEvents, { start, description }]);
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

  const isStartDisabled = useMemo(() => !!eventSource, [eventSource]);
  const isStopDisabled = useMemo(() => !eventSource, [eventSource]);

  return (
    <div>
      <h1>Server Sent Events</h1>
      <Button onClick={notify}>Notify!</Button>
      <ToastContainer />
      <div className="p-3 flex gap-3">
        <Button onClick={startSSE} disabled={isStartDisabled}>
          Start
        </Button>
        <Button onClick={stopSSE} disabled={isStopDisabled}>
          Stop
        </Button>
      </div>
      <div id="sse-data">
        {events.map(({ start, description, frequency }, index) => (
          <div className="flex gap-2" key={index}>
            <span className="text-blue-900">{start}</span>
            <span className="text-lg">{description}</span>
            <span className="text-lg">{frequency}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomComponent;
