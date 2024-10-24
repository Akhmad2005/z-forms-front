'use client'

import { useTranslations } from "next-intl";
import { Table, TableProps, Button, Space, Tag } from "antd";
import { EyeFilled } from '@ant-design/icons'
import { useCookies } from "next-client-cookies";
import { Link, useRouter } from "@/i18n/routing";
import { fetchClient } from "@/utilities/functions/fetchClient";
import { useEffect, useState } from "react";
import { ReadOnlyTemplateDetail } from "@/utilities/interfaces/template";
import { Tag as TemplateTag } from '@/utilities/interfaces/tag'


const HomePopularTemplates = () => {
	const cookies = useCookies();
	const router = useRouter();
	const t = useTranslations(); 
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<ReadOnlyTemplateDetail[]>([]);

	const columns: TableProps['columns'] = [
		{
			title: t('title'),
			key: 'title',
			dataIndex: 'title',
		},
		{
			title: t('creator'),
			dataIndex: 'user',
			filterMultiple: false,
		},
		{
			title: t('TemplateTopic'),
			key: 'topic',
			dataIndex: 'topic',
		},
		{
			title: t('TemplateTags'),
			key: 'tags',
			dataIndex: 'tags',
			render: (value) => (
				<div>
					<Space>
						{
							value?.map((tag: TemplateTag) => (
                <Tag  key={tag._id}>
                  {tag.name}
                </Tag>
              ))
						}
					</Space>
				</div>
			)
		},
		{
			title: t('FilledForms'),
			key: 'formCount',
			dataIndex: 'formCount',
		},
		{
			title: '',
			render: (text: string, record) => (
        <div>
					<Link href={`/forms/create?templateId=${record._id}`}>
						<Button 
							type='primary' 
							icon={<EyeFilled/>}
							/>
					</Link>
				</div> 
			),
			width: '1%',
			fixed: 'right',
		}
	]

	const fetchData = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/templates/list/popular?limit=${5}`,
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
						{t('PopularTemplates')}
					</h2>
				</div>
				<div className="">
					<Table 
						rowKey='_id'
						loading={loading}
						columns={columns}
						dataSource={data}
						rowHoverable={true}
						bordered={true}
						pagination={{
							position: ['bottomCenter'],
							hideOnSinglePage: true
						}}
					></Table>
				</div>
			</div>
		</div>
	)
}

export default HomePopularTemplates;