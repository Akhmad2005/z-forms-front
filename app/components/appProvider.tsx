'use client'

import React, { useEffect, useState } from 'react';
import { ConfigProvider } from "antd"
import { AppProgressBar } from 'next-nprogress-bar';
import { useTheme } from "next-themes";
import GEmpty from './g/empty';
import ruRU from 'antd/es/locale/ru_RU';
import enGB from 'antd/es/locale/en_GB';
import { Locale } from 'antd/es/locale';

import 'dayjs/locale/ru';
import 'dayjs/locale/en-gb';

const locales: {[key: string]: Locale} = {
	ru: ruRU,
  en: enGB,
}

interface Props { 
	children: React.ReactNode; 
	locale: string; 
} 

const AppProvider = ({children, locale}: Props ) => {
	const {theme} = useTheme();

	const [styles, setStyles] = useState<any>()

  useEffect(() => {
		setStyles(getComputedStyle(document.documentElement))
  }, [theme]);

	return (
		<ConfigProvider 
			locale={locales[locale]}
			renderEmpty={() => <GEmpty />}
			select={{
				showSearch: true,
			}}
			theme={{
				cssVar: true,
				token: {
					colorPrimary: styles?.getPropertyValue("--primary-color") || '',
					colorText: 'var(--text-color)',
					colorBorder: 'var(--border-color)',
					colorTextPlaceholder: 'var(--text-placeholder-color)',
					colorBgContainer: styles?.getPropertyValue('--input-color') || '',
					colorBgElevated: 'var(--input-color)',
					colorIcon: 'var(--text-color)',
					colorError: styles?.getPropertyValue("--error-color") || '',
					colorTextDescription: 'var(--text-description-color)',
					colorTextDisabled: 'var(--text-placeholder-color)',
					colorSplit: 'var(--scroll-bg-color)',
					colorLink: styles?.getPropertyValue("--link-color") || '',
				},
				components: {
					Table: {
						headerBorderRadius: 0,
						colorIcon: 'var(--text-color)',
						headerBg: 'var(--background-color)',
						borderColor: 'var(--border-color)',
						rowHoverBg: 'var(--hover-bg-color)',
						headerColor: 'var(--text-color)',
						colorText: 'var(--text-color)',
						stickyScrollBarBg: 'var(--primary-color)',
						colorBgContainer: 'var(--background-color)',
					},
					Pagination: {
						itemBg: 'transparent',
						itemActiveBg: 'transparent',
						colorText: 'var(--text-color)',
					},
					Menu: {
						itemSelectedBg: 'var(--primary-color)',
						itemSelectedColor: 'var(--text-color)',
					},
					Switch: {
						colorTextQuaternary: 'var(--text-description-color)',
					},
					Select: {
						optionActiveBg: 'var(--primary-color)',
						optionSelectedBg: 'var(--primary-color)',
						multipleItemBg: 'var(--primary-color)',
						colorTextQuaternary: 'var(--text-placeholder-color)',
					},
					Tag: {
						defaultBg: 'var(--primary-color)',
						colorTextDescription: 'var(--text-active-color)',
						colorTextHeading: 'var(--text-active-color)',
						colorText: 'var(--text-active-color)'
					},
					Modal: {
						contentBg: 'var(--background-color)',
					},
					Dropdown: {
						controlItemBgActive: 'var(--primary-color)',
					},
					Button: {
						defaultBorderColor: 'var(--border-color)',
						colorBorder: 'var(--text-color)',
						colorPrimaryHover: 'unset',
						colorPrimaryActive: 'unset',
					},
					InputNumber: {
						colorTextDescription: 'var(--text-color)',
					},
					Avatar: {
						colorTextPlaceholder: 'var(--primary-color)',
					}
				}
			}}
		>
			{children}
			<AppProgressBar  
				height="4px"
				color="var(--link-color)"
				options={{
					showSpinner: false
				}}
			>
			</AppProgressBar>	
		</ConfigProvider>
	)
}

export default AppProvider