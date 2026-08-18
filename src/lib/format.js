import { format, parseISO } from 'date-fns';
export const kes = (n) => `KES ${n.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
export const fmtDate = (iso) => format(parseISO(iso), 'dd MMM yyyy');
export const fmtDateTime = (iso) => format(parseISO(iso), 'dd MMM yyyy, HH:mm');
export const todayISO = () => format(new Date(), 'yyyy-MM-dd');
export function addDaysISO(iso, days) {
    const d = parseISO(iso);
    d.setDate(d.getDate() + days);
    return format(d, 'yyyy-MM-dd');
}
