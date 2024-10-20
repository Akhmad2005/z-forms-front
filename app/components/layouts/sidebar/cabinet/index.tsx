'use client'

import styles from './index.module.scss'
import React, { useMemo, useState } from 'react';
import { Menu, MenuTheme } from 'antd';
import { useTheme } from 'next-themes';
import { menuItems } from '@/utilities/const/menu';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCookies } from 'next-client-cookies';


const CabinetSidebar = () => {
	const cookies = useCookies();
	const t = useTranslations();
	const pathName = usePathname() 
	const router = useRouter();
  const { theme } = useTheme()
	const [mounted, setMounted] = useState<boolean>(false);


	const activeMenuItem = useMemo(() => {
		const key = pathName?.split('/').at(-1);
		return [key || '']
	}, [menuItems(router, t, cookies)?.length])

	return (
		<div>
			{
				<div className={styles['cabinet_sidebar']}>
					<div className={styles['cabinet_sidebar-scroll_container']}>
						<Menu
							style={{background: 'var(--background-color'}}
							theme={theme as MenuTheme}
							mode="inline"
							defaultSelectedKeys={activeMenuItem}
							items={menuItems(router, t, cookies)}
						/>
					</div>
				</div>
			}
		</ div>
	)
}

export default CabinetSidebar;