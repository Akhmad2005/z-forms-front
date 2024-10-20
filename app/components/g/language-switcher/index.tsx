'use client'

import { Link, locales, usePathname } from "@/i18n/routing";
import {useLocale} from "next-intl";
import styles from './index.module.scss'

const LanguageSwitcher = () => {
	const pathName = usePathname();
	const currentLocale = useLocale();
	return (
		<>
			<ul className={styles.list}>
				{
					locales.map((locale, i) => (
						<Link 
							className={`${styles['list-item']}  ${locale.code == currentLocale && styles['list-item-active']}`} 
							key={i}
							href={pathName} 
							locale={locale.code}
						>
							<li 
								key={i}
								>
								<span>
									{locale.title}
								</span>
							</li>
						</Link>
          ))
				}
			</ul>
		</>
	)
}

export default LanguageSwitcher;