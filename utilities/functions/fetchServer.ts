'use server'

import { cookies } from "next/headers"

interface Props {
  endpoint: string
  options?: RequestInit
  withToken?: boolean
}

export const fetchServer = async ({endpoint, options = {}, withToken = true}: Props) => {
  const SSRCookies = cookies();
	const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try { 
    const token = SSRCookies.get('auth-token');
    const locale = SSRCookies.get('NEXT_LOCALE');
    console.log(token);
    
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Accept-Language': 'ru',
        'Content-Type': 'application/json',
        // Authorization: withToken && token ? token : '',
        ...(options.headers || {}),
      },
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
};