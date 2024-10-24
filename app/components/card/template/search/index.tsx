'use client'

import styles from './index.module.scss'
import { ReadOnlyTemplateDetail } from "@/utilities/interfaces/template";
import SanitizedHTML from '@/app/components/g/sanitized-html';
import { Tag } from 'antd';
import { useTranslations } from 'next-intl';

interface Props {
	item: ReadOnlyTemplateDetail
}

const CardTemplateSearch = ({item}: Props) => {
	const t = useTranslations();

	return (
		<div className={styles['card']}>
			<div className={styles['card-wrapper']}>
				<header className={styles['card-header']}>
					<h4>{item?.title || ''}</h4>
					<SanitizedHTML htmlContent={item.description}></SanitizedHTML>
				</header>
				<footer className={styles['card-footer']}>
					<div>
						<div className={styles['card-topic']}>
							<p>
								{`${t('topic')}: `}
								<Tag>
									{item.topic}
								</Tag>
							</p>
						</div>
						<div className={styles['card-creator']}>
							<p>
								<strong>
									{item.user}
								</strong>
							</p>
						</div>
					</div>
					<div className={styles['card-date']}>
						<span>{item.createdAt || ''}</span>
					</div>
				</footer>

			</div>
		</div>
	)
}

export default CardTemplateSearch;