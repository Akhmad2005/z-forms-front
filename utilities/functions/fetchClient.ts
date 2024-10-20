import { Cookies } from 'next-client-cookies';
import { RouterIntl } from '../interfaces/router';
import { exitFromAccount } from './account';
import { message } from 'antd';
interface Props {
  cookies: Cookies
  endpoint: string
  options?: RequestInit
  withToken?: boolean
  router: RouterIntl
}

export const fetchClient = async ({cookies, endpoint, options = {}, withToken = true, router}: Props) => {
	const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try { 
    const token = cookies.get('auth-token');
    const locale = cookies.get('NEXT_LOCALE');

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Accept-Language': locale || 'en',
        'Content-Type': 'application/json',
        Authorization: withToken && token ? `Beare ${token}` : '',
        ...(options.headers || {}),
      },
    });

    if (response.status == 401 ) {
      exitFromAccount(cookies, router)
    }
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data?.message || data?.error || 'Undefined error'}:${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};