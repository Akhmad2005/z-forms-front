import { Empty } from 'antd';
import { useTranslations } from 'next-intl';

const GEmpty = () => {
	const t = useTranslations();
	return (
		<Empty 
			image={Empty.PRESENTED_IMAGE_SIMPLE} 
			className='icon' 
			description={t('NoData')} 
		/>
	)
};

export default GEmpty;