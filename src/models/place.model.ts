import { Translations } from "../types/translations";

export interface CreatePlaceDTO {


    provinceId: number;
    areaId?: number | null;


    name: string;


    summary?: string;


    description?: string;


    visit_info?: string;


    latitude?: number;


    longitude?: number;


    /** مكان استكشاف: تفاصيل ووسائط وموقع فقط — بلا تحديات ولا طوابع ولا QR. */
    isExploration?: boolean;



    translations?: Translations;

}



export interface UpdatePlaceDTO {



    name?: string;


    summary?: string;


    description?: string;


    visit_info?: string;


    latitude?: number;


    longitude?: number;


    status?: boolean;
    areaId?: number | null;

    /** مكان استكشاف: تفاصيل ووسائط وموقع فقط — بلا تحديات ولا طوابع ولا QR. */
    isExploration?: boolean;




    translations?: Translations;

}