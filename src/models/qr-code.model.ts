import {
    QRTargetType
} from "../entities/qr-code.entity";



export interface CreateQRCodeDTO {


    bookCopyId:number;



    target_type:QRTargetType;



    target_id:number;


}