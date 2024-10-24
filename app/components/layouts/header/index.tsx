
import styles from './index.module.scss'
import LanguageSwitcher from '../../g/language-switcher'
import ThemeSwitcher from '../../g/theme-switcher'
import ProfileDropdown from '../../g/profileDropdown'
import TemplateSearchInput from '../../g/templateSearchInput'
import { Link } from '@/i18n/routing'

const LayoutHeader = () => {
	return (
		<header className={styles.header}>
			<div className="container">
				<div className={styles['header-wrapper']}>
					<div className={styles.logo}>
						<Link href={'/'}>
							<h1>
								Z Forms
							</h1>
						</Link>
					</div>
					<div className={styles.actions}>
						<div className={styles['actions-search']}>
							<TemplateSearchInput></TemplateSearchInput>
						</div>
						<div className={styles['actions-language_switcher']}>
							<LanguageSwitcher></LanguageSwitcher>
						</div>
						<div className={styles['actions-theme_switcher']}>
							<ThemeSwitcher></ThemeSwitcher>
						</div>
						<div className={styles['actions-profile']}>
							<ProfileDropdown></ProfileDropdown>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
} 

export default LayoutHeader