'use client'

import { AnswerTypeEnum } from "@/utilities/enums/answer"
import { Input, InputNumber, DatePicker, TimePicker, FormInstance } from "antd"
import { useTranslations } from "next-intl"
import { useMemo } from "react"

interface Props {
	type: AnswerTypeEnum
	placeholder: string
	form: FormInstance<any>
	formKey: string | string[]
}

const AnswerTypeItem = ({type, placeholder, form, formKey}: Props) => {
	const t = useTranslations();
	const Item = useMemo(() => {
		switch (type) {
			case 'Input':
				return (
					<Input 
						defaultValue={form.getFieldValue(formKey)}
						placeholder={placeholder}
						onChange={(e) => {
							form.setFieldValue(formKey, e.target.value)
						}}
					/>
				)
			case 'InputIntegerNumber':
				return (
					<InputNumber 
						defaultValue={form.getFieldValue(formKey)}
						placeholder={placeholder}
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
						defaultValue={form.getFieldValue(formKey)}
						placeholder={placeholder}
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
						defaultValue={form.getFieldValue(formKey)}
						autoSize={{
							minRows: 3, 
							maxRows: 4,
						}}
						placeholder={placeholder}
						onChange={(e) => {
							form.setFieldValue(formKey, e.target.value)
						}}
					/>
				)
			case 'Date':
				return (
					<DatePicker
						defaultValue={form.getFieldValue(formKey)}
						style={{width: '100%'}}
						placeholder={placeholder}
						format={'DD.MM.YYYY'}
						onChange={(_, dateString) => {
							form.setFieldValue(formKey, dateString)
						}}
					/>
				)
			case 'Time':
				return (
					<TimePicker
						defaultValue={form.getFieldValue(formKey)}
						style={{width: '100%'}}
						placeholder={placeholder}
						format={'HH:mm'}
						onChange={(_, dateString) => {
							form.setFieldValue(formKey, dateString)
						}}
					/>
				)
			case 'DateTime':
				return (
					<DatePicker
						defaultValue={form.getFieldValue(formKey)}
						showTime={true}
						style={{width: '100%'}}
						placeholder={placeholder}
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