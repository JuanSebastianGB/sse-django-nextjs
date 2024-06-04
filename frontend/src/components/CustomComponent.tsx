'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';

import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

const SSE_URL = 'http://localhost:8000/mstream';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const LIMIT_COUNT = 5;

export const CustomComponent = () => {
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
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
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

  const isStartDisabled = useMemo(() => !!eventSource, [eventSource]);
  const isStopDisabled = useMemo(() => !eventSource, [eventSource]);

  return (
    <div>
      <h1>Server Sent Events</h1>
      <div className="p-3 flex gap-3">
        <Button onClick={startSSE} disabled={isStartDisabled}>
          Start
        </Button>
        <Button onClick={stopSSE} disabled={isStopDisabled}>
          Stop
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            This is a view to show events catch from SSE implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of events.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">frequency</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(({ start, description, frequency }, index) => (
                <TableRow key={index}>
                  <TableCell>{description}</TableCell>
                  <TableCell className="text-right">{frequency}</TableCell>
                  <TableCell>{start}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomComponent;
