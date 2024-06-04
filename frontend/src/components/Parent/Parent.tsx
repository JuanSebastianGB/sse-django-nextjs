'use client';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';

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
import { useSse } from './hooks/useSse';

export const Parent = () => {
  const { events, eventSource, startSSE, stopSSE } = useSse();

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

export default Parent;
