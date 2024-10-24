'use client'

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Row, Col, Spin, Empty } from "antd";
import CardTemplate from "../../card/template";
import { useCookies } from "next-client-cookies";
import { useRouter, Link } from "@/i18n/routing";
import { fetchClient } from "@/utilities/functions/fetchClient";
import { useEffect, useState } from "react";
import { ReadOnlyTemplateDetail } from "@/utilities/interfaces/template";

const HomeLatestTemplates = () => {
	const cookies = useCookies();
	const router = useRouter();
	const t = useTranslations(); 
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<ReadOnlyTemplateDetail[]>([]);

	const RenderList = useMemo(() => {
		if (loading) {
			return (
				<Row justify={'center'} gutter={[
					{ xl: 24, xs: 12, sm: 12, },
					{ xl: 24, xs: 12, sm: 12, },
				]}> 
					<Col>
						<Spin spinning={loading}></Spin>
					</Col>
				</Row>
			)
		} else if (data?.length) {
			return (
				<Row justify={"start"} gutter={[
					{ xl: 24, xs: 12, sm: 12, },
					{ xl: 24, xs: 12, sm: 12, },
				]}>
					{
						data.map((template, index) => (
							<Col key={index} xs={24} md={12} xl={6}>
								<Link href={`/forms/create?templateId=${template._id}`}>
									<CardTemplate template={template}/>
								</Link>
							</Col>
						))
					}
				</Row>
			)
		} else {
			return (
				<Row gutter={[
					{ xl: 24, xs: 12, sm: 12, },
					{ xl: 24, xs: 12, sm: 12, },
				]} justify={'center'}> 
					<Col>
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
					</Col>
				</Row>
			)
		}
	}, [data, loading])

	const fetchData = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/templates/list/latest?limit=${8}`,
        cookies,
        router,
			}) 
			setData(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, [])

	return (
		<div className="home-section">
			<div className="container">
				<div className="home-section-title">
					<h2>
						{t('LatestTemplates')}
					</h2>
				</div>
				<div >
					{RenderList}
				</div>
			</div>
		</div>
	)
}

export default HomeLatestTemplates;