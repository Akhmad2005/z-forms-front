import { Question } from "../types/question";
import { Tag } from "./tag";

export interface TemplateMainForm {
	title: string;
	description: string;
	topicId: number | null;
	tags: number[];
}

export interface TemplatePrivacyForm {
	accessControl: 'public' | 'private';
	allowedUsers: TemplateUserId[];
}

type TemplateUserId = number | string;

export interface ReadOnlyTemplateDetail extends Omit<TemplateMainForm, 'tags'>, TemplatePrivacyForm {
	questions: Question[];
	tags: Tag[];
	topic: string;
	_id: string;
}