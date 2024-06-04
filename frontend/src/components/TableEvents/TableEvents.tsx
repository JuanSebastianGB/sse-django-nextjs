'use client';

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

export const TableEvents = () => {
  const { events } = useSse();

  return (
    <div>
      <h1>Server Sent Events</h1>

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

export default TableEvents;
