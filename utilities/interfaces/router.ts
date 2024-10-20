import { NavigateOptions, PrefetchOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";


export interface RouterIntl {
	push: (href: string, options?: (NavigateOptions & {
		locale?: string | undefined;
	}) | undefined) => void;
	replace: (href: string, options?: (NavigateOptions & {}) | undefined) => void;
	prefetch: (href: string, options?: (PrefetchOptions & {}) | undefined) => void;
	back(): void;
	forward(): void;
	refresh(): void;
}