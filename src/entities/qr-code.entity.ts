import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";


import {
    BookCopy
} from "./book-copy.entity";



export enum QRTargetType {

    PROVINCE = "PROVINCE",

    PLACE = "PLACE"

}



@Entity("qr_codes")
export class QRCode {


    @PrimaryGeneratedColumn()
    id!:number;



    @ManyToOne(
        ()=>BookCopy,
        copy=>copy.qrs,
        {
            onDelete:"CASCADE"
        }
    )
    @JoinColumn({
        name:"book_copy_id"
    })
    book_copy!:BookCopy;



    /*
       نفس السيريال الموجود بالكتيب
    */

    @Column()
    serial_number!:string;




    /*
       رقم الإصدار
    */

    @Column()
    version!:string;




    /*
       المحافظة او المكان
    */

    @Column({
        type:"enum",
        enum:QRTargetType
    })
    target_type!:QRTargetType;




    /*
       id المحافظة او المكان
    */

    @Column()
    target_id!:number;




    /*
       الرابط الذي يتحول إلى QR
    */

    @Column({
        unique:true
    })
    qr_value!:string;




    @CreateDateColumn()
    created_at!:Date;


}