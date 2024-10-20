export const metadata = {
  title: 'Cabinet',
  description: 'User cabinet page',
};
import CabinetSidebar from '@/app/components/layouts/sidebar/cabinet';
import styles from './layout.module.scss'
import { Suspense } from 'react';


const CabinetLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className={styles['cabinet_layout']}>
			<aside className={styles['cabinet_layout-sidebar']}>
				<CabinetSidebar></CabinetSidebar>
			</aside>
			<Suspense fallback={<>Loading...</>}>
				<main className={styles['cabinet_layout-page']}>
					{children}
				</main>
			</Suspense>
		</div>
	)
}

export default CabinetLayout;