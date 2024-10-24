'use client'
import styles from './index.module.scss'
import { ReadOnlyTemplateDetail } from '@/utilities/interfaces/template'
import SanitizedHTML from '../../g/sanitized-html'
import { useTranslations } from 'next-intl'
import { Tag, Button } from 'antd'
import {SelectOutlined} from '@ant-design/icons'
import { Link } from "@/i18n/routing";

interface Props {
  template: ReadOnlyTemplateDetail
}

const CardTemplate = ({template}: Props) => {
	const t = useTranslations();

	return (
		<div className={styles['card']}>
			<div className={styles['card-wrapper']}>
				<div className={styles['card-title']}>
					<h3>
						{template.title || ''}
					</h3>
				</div>
				<div className={styles['card-description']}>
					<SanitizedHTML htmlContent={template.description}></SanitizedHTML>
				</div>
				<footer className={styles['card-footer']}>
					<div className={styles['card-topic']}>
						<p>
							{`${t('topic')}: `}
							<Tag>
								{template.topic}
							</Tag>
						</p>
					</div>
					<div className={styles['card-creator']}>
						<p>
							<strong>
								{template.user}
							</strong>
						</p>
					</div>
				</footer>
			</div>
			{/* <div className={styles['card-link']}>
				<Link href={`/forms/create?templateId=${template._id}`}>
					<Button type='primary' icon={<SelectOutlined/>}/>
				</Link>
			</div> */}
		</div>
	)
}

export default CardTemplate;