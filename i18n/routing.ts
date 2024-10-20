import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const locales = [
  {
    code: 'en',
    title: 'en',
  },
  {
    code: 'ru',
    title: 'ру',
  },
];
export const defaultLocale = 'en';

export const routing = defineRouting({
  locales: locales.map(l => (l.code)),
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed'
});
 
export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation(routing);