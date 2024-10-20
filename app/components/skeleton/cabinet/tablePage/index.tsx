import { Skeleton, Row, Col } from "antd";
import styles from './index.module.scss'

const TablePageSkeleton = () => {
	return (
		<div className={styles.page}>
			<header className={styles['page-header']}>
				<Row gutter={[12, 12]} align={'middle'}>
					<Col span={3}>
						<Skeleton.Button block active/>
					</Col>
					<Col flex={1}>
					</Col>
					<Col span={3}>
						<Skeleton.Button block active/>
					</Col>
				</Row>
			</header>
			<main className={styles['page-main']}>
				{
					new Array(3).fill(null).map((e, i) => (
						<Skeleton.Button key={i} block active/>
					))
				}
			</main>
			<footer className={styles['page-footer']}>
				<Row>
					<Col flex={1}>
					</Col>
					<Col span={4}>
						<Skeleton.Button size="large" active block/>
					</Col>
					<Col flex={1}>
					</Col>
				</Row>
			</footer>
		</div>
	)
}

export default TablePageSkeleton;
