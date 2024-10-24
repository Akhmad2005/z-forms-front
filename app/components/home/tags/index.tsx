'use client'

import styles from './index.module.scss'
import { useTranslations } from "next-intl";
import { Button, Space, Tag, Row, Col } from "antd";
import { LeftOutlined, EyeFilled, RightOutlined } from '@ant-design/icons'
import { useCookies } from "next-client-cookies";
import { Link, useRouter } from "@/i18n/routing";
import { fetchClient } from "@/utilities/functions/fetchClient";
import { useEffect, useState } from "react";
import { Tag as TemplateTag } from '@/utilities/interfaces/tag'
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from 'swiper/modules'


const HomeTags = () => {
	const cookies = useCookies();
	const router = useRouter();
	const t = useTranslations(); 
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<TemplateTag[]>([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/tags/popular`,
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

	if (!data?.length) {
		return null
	}

	return (
		<div className="home-section home-section-small">
			<div className="container">
				<div className={styles.tags}>
					<Row wrap={false} gutter={2}>
						<Col id='tags-prev' className='swiper-button swiper-button-hide-disabled'>
							<Tag style={{marginRight: 0, padding: 0}} icon={<LeftOutlined />}></Tag>
						</Col>
						<Col flex={1}>
							<Swiper
								modules={[Navigation]}
								navigation={{
									prevEl: '#tags-prev',
									nextEl: '#tags-next',
									hiddenClass: 'hidden'
								}}
								spaceBetween={0}
								slidesPerView={'auto'}
							>
								{
									data.map(tag => (
										<SwiperSlide key={tag._id} style={{width: 'fit-content'}}>
											<Link href={`/search/t/?tagId=${tag._id}`} >
												<Tag>{`#${tag.name}`}</Tag>
											</Link>
										</SwiperSlide>
									))
								}
							</Swiper>
						</Col>
						<Col id='tags-next' className='swiper-button swiper-button-hide-disabled'>
							<Tag style={{marginRight: 0, padding: 0}}  icon={<RightOutlined />}></Tag>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	)
}

export default HomeTags;