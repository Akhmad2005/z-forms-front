'use client'
import { useRouter } from "@/i18n/routing"
import { Input } from "antd"
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TemplateSearchInput = () => {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState<string>(searchParams.get('search') || ''); 
	const handleSearch = (value: string) => {
		router.push(`/search/t?search=${value}`)
	}

	useEffect(() => {
    setSearchValue(searchParams.get('search') || '')
  }, [searchParams.get('search')])

	return (
		<div>
			<Input.Search placeholder={t('SearchTemplates')} onChange={(e) => {setSearchValue(e.target.value)}} value={searchValue} onSearch={handleSearch} size="small"/>
		</div>
	)
}

export default TemplateSearchInput