import { Translations } from "../types/translations";

export interface CreateAreaDTO {
    provinceId: number;
    name: string;
    description?: string;
    translations?: Translations;
}

export interface UpdateAreaDTO {
    provinceId?: number;
    name?: string;
    description?: string;
    status?: boolean;
    translations?: Translations;
}
