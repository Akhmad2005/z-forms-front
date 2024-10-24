'use client'
import FillTemplateForm from "@/app/components/form/fillTemplate/index"
import styles from './page.module.scss'

const App = () => {
	return (
		<div className={styles['page']}>
			<div className="container">
				<div className={styles['page-wrapper']}>
					<FillTemplateForm/>
				</div>
			</div>
		</div>
	)
}

export default App