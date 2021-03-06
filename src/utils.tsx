import slugify from 'slugify';
import { parseISO, format, subMinutes } from 'date-fns';
import { Event } from 'types/Types';
import { UserStudy, UserClass } from 'types/Enums';

export const urlEncode = (text = '') => slugify(text, { lower: true, strict: true, locale: 'nb' });

// Short down string if needed
export const shortDownString = (string: string, charsToShortDown: number) => {
  if (string.length > charsToShortDown) {
    string = string.slice(0, charsToShortDown) + '...';
  }
  return string;
};

// Get user study short
export const getUserStudyShort = (userStudy: UserStudy) => {
  switch (userStudy) {
    case UserStudy.DATAING:
      return 'Dataing';
    case UserStudy.DIGFOR:
      return 'DigFor';
    case UserStudy.DIGSEC:
      return 'DigSec';
    case UserStudy.DIGSAM:
      return 'DigSam';
    case UserStudy.DRIFT:
      return 'Drift';
    default:
      return 'Ukjent studie';
  }
};
// Get user study long
export const getUserStudyLong = (userStudy: UserStudy) => {
  switch (userStudy) {
    case UserStudy.DATAING:
      return 'Dataingeniør';
    case UserStudy.DIGFOR:
      return 'Digital forretningsutvikling';
    case UserStudy.DIGSEC:
      return 'Digital infrastruktur og cybersikkerhet';
    case UserStudy.DIGSAM:
      return 'Digital samhandling';
    case UserStudy.DRIFT:
      return 'Drift av datasystemer';
    default:
      return 'Ukjent studie';
  }
};
// Get user class
export const getUserClass = (userClass: UserClass) => {
  switch (userClass) {
    case UserClass.ALUMNI:
      return 'Alumni';
    case UserClass.FIRST:
      return '1. klasse';
    case UserClass.SECOND:
      return '2. klasse';
    case UserClass.THIRD:
      return '3. klasse';
    case UserClass.FOURTH:
      return '4. klasse';
    case UserClass.FIFTH:
      return '5. klasse';
    default:
      return 'Ukjent klasse';
  }
};

// Add leading zero to numbers below 10. Ex: 2 -> 02, 12 -> 12
const addLeadingZero = (number: number) => (number < 10 ? '0' + number : number);

export const formatDate = (date: Date) => {
  const isDifferentYear = date.getFullYear() !== new Date().getFullYear();
  return `${getDay(date.getDay())} ${date.getDate()} ${getMonth(date.getMonth())} ${isDifferentYear ? date.getFullYear() : ''} - kl. ${addLeadingZero(
    date.getHours(),
  )}:${addLeadingZero(date.getMinutes())}`;
};

export const getTimeSince = (date: Date) => {
  const ms = new Date().getTime() - date.getTime();
  const sec = Number((ms / 1000).toFixed(0));
  const min = Number((ms / (1000 * 60)).toFixed(0));
  const hrs = Number((ms / (1000 * 60 * 60)).toFixed(0));
  const days = Number((ms / (1000 * 60 * 60 * 24)).toFixed(0));
  if (sec < 60) {
    return `${sec} sekunder siden`;
  } else if (min < 60) {
    return `${min} minutter siden`;
  } else if (hrs < 24) {
    return `${hrs} timer siden`;
  } else if (days < 7) {
    return `${days} dager siden`;
  } else {
    return formatDate(date);
  }
};

export const getDay = (day: number) => {
  switch (day) {
    case 0:
      return 'Søn.';
    case 1:
      return 'Man.';
    case 2:
      return 'Tirs.';
    case 3:
      return 'Ons.';
    case 4:
      return 'Tors.';
    case 5:
      return 'Fre.';
    case 6:
      return 'Lør.';
    default:
      return day;
  }
};
export const getMonth = (month: number) => {
  switch (month) {
    case 0:
      return 'jan';
    case 1:
      return 'feb';
    case 2:
      return 'mars';
    case 3:
      return 'april';
    case 4:
      return 'mai';
    case 5:
      return 'juni';
    case 6:
      return 'juli';
    case 7:
      return 'aug';
    case 8:
      return 'sep';
    case 9:
      return 'okt';
    case 10:
      return 'nov';
    case 11:
      return 'des';
    default:
      return month;
  }
};

/**
 * Transforms a date to when UTC+0 will be at the same time.
 * Ex.: 15:00 in UTC+2 is transformed to 17:00 as UTC+0 at that time will be 15:00
 * @param date - The date to transform
 * @returns A new date
 */
export const dateAsUTC = (date: Date): Date => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
};

/**
 * Transforms a date to UTC+0.
 * Ex.: 15:00 in UTC+2 is transformed to 13:00 as thats the equivalent time in UTC+0
 * @param date - The date to transform
 * @returns A new date
 */
export const dateToUTC = (date: Date): Date => {
  return subMinutes(date, -date.getTimezoneOffset());
};

/**
 * Create a ICS-file from an event
 * @param event - The event
 * @returns A ICS-string
 */
export const getICSFromEvent = (event: Event): string => {
  const formating = `yyyyMMdd'T'HHmmss'Z'`;
  const start = format(dateToUTC(parseISO(event.start_date)), formating);
  const end = format(dateToUTC(parseISO(event.end_date)), formating);

  const calendarChunks = [
    { key: 'BEGIN', value: 'VCALENDAR' },
    { key: 'VERSION', value: '2.0' },
    { key: 'BEGIN', value: 'VEVENT' },
    { key: 'URL', value: `https://s.tihlde.org/a/${event.id}/` },
    { key: 'DTSTART', value: start },
    { key: 'DTEND', value: end },
    { key: 'SUMMARY', value: event.title },
    { key: 'DESCRIPTION', value: `Se arrangementet på: https://s.tihlde.org/a/${event.id}/` },
    { key: 'LOCATION', value: event.location },
    { key: 'END', value: 'VEVENT' },
    { key: 'END', value: 'VCALENDAR' },
  ];

  const calendarUrl = calendarChunks
    .filter((chunk) => chunk.value)
    .map((chunk) => `${chunk.key}:${encodeURIComponent(`${chunk.value}\n`)}`)
    .join('');
  return `data:text/calendar;charset=utf8,${calendarUrl}`;
};

/**
 * Converts a JSON-object into args which can be transfered in an URL
 * @param data A JSON-object
 * @returns String with format: `?key1=value1&key2=value2`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const argsToParams = (data: Record<string, any>) => {
  let args = '?';
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const value in data[key] as any) {
        args += `&${key}=${data[key][value]}`;
      }
    } else if (!(data[key] === undefined || (typeof data[key] === 'string' && data[key].trim().length === 0))) {
      args += `&${key}=${data[key]}`;
    }
  }
  return args;
};
