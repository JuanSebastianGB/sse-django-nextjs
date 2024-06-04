'use client';

import { useEffect, useMemo } from 'react';
import { useSse } from '../TableEvents/hooks/useSse';

import { useToast } from '@/components/ui/use-toast';

const DEFAULT_DATE_STRING = '2029-12-31 23:59:59';

/**
 * Calculates the number of days and hours left from the current date and time to a given target date and time.
 * @param {string} targetDateStr - The target date and time in the format "YYYY-MM-DD HH:mm:ss".
 * @returns {Object} An object containing the number of days and hours left.
 */
//@ts-ignore
function calculateTimeLeft(targetDateStr = DEFAULT_DATE_STRING) {
  const targetDate = new Date(targetDateStr.replace(' ', 'T'));
  const currentDate = new Date();

  //@ts-ignore
  const differenceInMilliseconds = targetDate - currentDate;

  if (differenceInMilliseconds <= 0) {
    return {
      days: 0,
      hours: 0,
    };
  }

  const millisecondsInOneHour = 1000 * 60 * 60;
  const millisecondsInOneDay = millisecondsInOneHour * 24;

  const daysLeft = Math.floor(differenceInMilliseconds / millisecondsInOneDay);
  const hoursLeft = Math.floor(
    (differenceInMilliseconds % millisecondsInOneDay) / millisecondsInOneHour
  );

  return {
    days: daysLeft,
    hours: hoursLeft,
  };
}

const Notification = () => {
  const { currentEvent } = useSse();

  const { toast } = useToast();

  const timeLeft = useMemo(
    () => calculateTimeLeft(currentEvent.start),
    [currentEvent]
  );

  useEffect(() => {
    toast({
      title: currentEvent.description,
      description: `The maintenance will start in ${timeLeft.days} days and ${timeLeft.hours} hours.`,
      variant: 'default',
    });
  }, [currentEvent, toast, timeLeft]);

  return <></>;
};
export default Notification;
