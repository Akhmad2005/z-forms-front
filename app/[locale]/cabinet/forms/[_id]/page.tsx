'use client'

import FillTemplateForm from "@/app/components/form/fillTemplate/index"
import { Row, Col } from "antd"
import { useTranslations } from "next-intl"

const App = () => {
	const t = useTranslations();
	return (
		<div className={'dashbord_page'}>
			<header className={'dashbord_page-header'}>
				<Row gutter={[12, 12]} align={'middle'}>
					<Col>
						<h3>
							{
								t('EditingTheForm')
							}
						</h3>
					</Col>
					<Col flex={1}></Col>
				</Row>
			</header>
			<main className={'dashbord_page-main dashbord_page-main-with_pd'}>
				<FillTemplateForm></FillTemplateForm>
			</main>
		</div>
	)
}

export default App