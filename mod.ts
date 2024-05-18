// capitalize() used by this file won't ever be capitalize("")
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

const weekdays = ['', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

const partsMap = {
  '2006': 'FullYear',
  '2': 'Date',     '02': 'Date',
  '15': 'Hours',
  '4': 'Minutes',  '04': 'Minutes',
  '5': 'Seconds',  '05': 'Seconds',
}

const handleVariants = (f: string, d: string) => {
  if (f[0] == '0')
    d = pad0(d);
  if (f[0].match(/^[A-Z]/) !== null)
    d = capitalize(d);
  if (f.match(/^[A-Z]+$/) !== null) {
    d = d.toUpperCase();
  }
  // Abbreviations
  if (['mon', 'jan'].includes(f.toLowerCase())) {
    d = d.slice(0, 3);
  }
  return d;
}

const getWithUTC = (date: Date, fn: string, utc: boolean) => {
  // deno-lint-ignore no-explicit-any
  return (date as any)['get' + (utc ? 'UTC' : '') + fn]()
}

const pad0 = (d: string) => (d.length === 1 ? '0' : '') + d

export const datefmt = (
  date: Date,
  fmt: string = '[2006]-[01]-[02]',
  utc: boolean = true,
  delim: string = '[]',
) => {
  if (delim.length > 2 || delim.length == 0) {
    throw new Error("'delim' argument must either have one or two characters.")
  }

  let s = "";
  const
    openD = delim[0],
    closeD = delim.length == 1 ? openD : delim[1];

  if (fmt == openD + closeD) {
    return openD + closeD;
  }

  for (const part of fmt.split(new RegExp(`(\\${openD}.+?\\${closeD})`))) {
    if (part.length <= 1) {
      s += part;
      continue;
    }
    if (part[0] == openD && part[part.length-1] == closeD) {
      const f = part.slice(1, part.length-1);
      let d: string;
      let n: number;
      const partFn = partsMap[f as keyof typeof partsMap];

      if (partFn !== undefined) {
        s += handleVariants(f, getWithUTC(date, partFn, utc).toString());
        continue;
      }

      switch (f) {
        case '2nd': case '2ND':
          n = getWithUTC(date, 'Date', utc) as number;
          d = (n%10 > 0 && n%10 <= 3) ? ['st', 'nd', 'rd'][n%10-1] : 'th';
          d = n.toString() + handleVariants(f.slice(1), d);
          break;
        case '6': case '06':
          d = handleVariants(f, (getWithUTC(date, 'FullYear', utc) - 2000).toString());
          break;
        case '3': case '03':
          d = handleVariants(f, (getWithUTC(date, 'Hours', utc) % 12).toString());
          break;
        case 'pm': case 'Pm': case 'PM':
          d = getWithUTC(date, 'Hours', utc) > 11 ? 'pm' : 'am';
          d = handleVariants(f, d);
          break;
        case '015':
          d = getWithUTC(date, 'Hours', utc).toString();
          d = handleVariants('01', d);
          break;
        case '1': case '01':
          d = handleVariants(f, (getWithUTC(date, 'Month', utc) + 1).toString());
          break;
        case 'Jan': case 'jan':
        case 'January': case 'january':
        case 'JAN': case 'JANUARY':
          d = handleVariants(f, months[getWithUTC(date, 'Month', utc)]);
          break;
        case 'mon': case 'Mon':
        case 'Monday': case 'monday':
        case 'MONDAY': case 'MON':
          d = handleVariants(f, weekdays[getWithUTC(date, 'Day', utc)]);
          break;
        case openD: case closeD:
          d = f;
          break;
        default:
          throw new Error(`Unknown date format replacement '${f}'`)
      }
      s += d;
    } else {
      s += part;
    }
  }
  return s;
}

export default datefmt;
