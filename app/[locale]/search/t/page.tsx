'use client'

import styles from './page.module.scss'
import { fetchClient } from "@/utilities/functions/fetchClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useCookies } from "next-client-cookies";
import { Empty, message, Spin, List } from "antd";
import { useTranslations } from "next-intl";
import { ReadOnlyTemplateDetail } from "@/utilities/interfaces/template";
import CardTemplateSearch from '@/app/components/card/template/search';

const App = () => {
	const router = useRouter();
	const cookies = useCookies();
	const searchParams = useSearchParams();
	const t = useTranslations();
	const [data, setData] = useState<ReadOnlyTemplateDetail[]>([]);
	const [loading, setLoading] = useState(false);

	const RenderList = useMemo(() => {
		if (loading) {
			return (
				<Spin spinning={loading}></Spin>
			)
		} else if (data?.length) {
			return (
				<>
					<List 
						pagination={{
							pageSize: 10,
							hideOnSinglePage: true
						}}
						itemLayout='horizontal' 
						dataSource={data} 
						split={true}
						rowKey={'_id'}
						grid={{
							column: 1,
							gutter: [0, 12]
						}}
						renderItem={(item) => (
							<Link href={`/forms/create?templateId=${item._id}`}>
								<CardTemplateSearch item={item}></CardTemplateSearch>
							</Link>
						)}
					/>
						
					{/* {
						data.map((item) => (
							<div>
								<Link href={`/forms/create?templateId=${item._id}`}>
									<CardTemplateSearch item={item}></CardTemplateSearch>
								</Link>
							</div>
						))
					}
					<div></div> */}
				</>
			)
		} else {
			return (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
			)
		}
	}, [data, loading])

	const fetchData = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				search: searchParams.get('search') || '',
				tagId: searchParams.get('tagId') || '',
			});
			let data = await fetchClient({
				endpoint: `/search?${params.toString()}`,
				cookies,
				router,
			})
			setData(data);
		} catch (error) {
			console.error(error);
			message.error(t('fetchError.fetchData'))
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, [searchParams.get('search')])
	return (
		<div className={styles['page']}>
			<div className="container">
				<div className={styles['page-list']}>
					{RenderList}
				</div>
			</div>
		</div>
	)
}

export default App;