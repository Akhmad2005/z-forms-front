'use client'

import { AnswerTypeEnum } from "@/utilities/enums/answer"
import { Input, InputNumber, DatePicker, TimePicker, FormInstance } from "antd"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { useCookies } from 'next-client-cookies';
import { parseJwt } from '@/utilities/functions/jwtParser';

interface Props {
	type: AnswerTypeEnum
	placeholder: string
	form: FormInstance<any>
	formKey: string | string[]
}

const AnswerTypeItem = ({type, placeholder, form, formKey}: Props) => {
	const cookies = useCookies();
	const parsedToken = parseJwt(cookies.get('auth-token'));
	const t = useTranslations();
	const mainPlaceholder = useMemo(():string => {
		if (parsedToken?._id) {
			return placeholder; 
		} else {
			return t('login')
		}
	}, [placeholder])
	const Item = useMemo(() => {
		switch (type) {
			case 'Input':
				return (
					<Input 
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						placeholder={mainPlaceholder}
						onChange={(e) => {
							form.setFieldValue(formKey, e.target.value)
						}}
					/>
				)
			case 'InputIntegerNumber':
				return (
					<InputNumber 
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						placeholder={mainPlaceholder}
						maxLength={16}
						style={{width: '100%'}}
						min={0}
						step={1} 
						parser={(v) => Math.round(Number(v) || 0)}
						onChange={(v) => {
							form.setFieldValue(formKey, v)
						}}
					/>
				)
			case 'InputFloatNumber':
				return (
					<InputNumber 
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						placeholder={mainPlaceholder}
						maxLength={16}
						style={{width: '100%'}}
						min={0}
						onChange={(v) => {
							form.setFieldValue(formKey, v)
						}}
					/>
				)
			case 'TextArea':
				return (
					<Input.TextArea 
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						autoSize={{
							minRows: 3, 
							maxRows: 4,
						}}
						placeholder={mainPlaceholder}
						onChange={(e) => {
							form.setFieldValue(formKey, e.target.value)
						}}
					/>
				)
			case 'Date':
				return (
					<DatePicker
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						style={{width: '100%'}}
						placeholder={mainPlaceholder}
						format={'DD.MM.YYYY'}
						onChange={(_, dateString) => {
							form.setFieldValue(formKey, dateString)
						}}
					/>
				)
			case 'Time':
				return (
					<TimePicker
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						style={{width: '100%'}}
						placeholder={mainPlaceholder}
						format={'HH:mm'}
						onChange={(_, dateString) => {
							form.setFieldValue(formKey, dateString)
						}}
					/>
				)
			case 'DateTime':
				return (
					<DatePicker
						disabled={!parsedToken?._id}
						defaultValue={form.getFieldValue(formKey)}
						showTime={true}
						style={{width: '100%'}}
						placeholder={mainPlaceholder}
						format={'DD.MM.YYYY HH:mm'}
						onChange={(_, dateString) => {
							form.setFieldValue(formKey, dateString)
						}}
					/>
				)
			default:
				break;
		}
	}, [type])

	return (
		<div>
			{
				Item
			}
		</div>
	)
}

export default AnswerTypeItem