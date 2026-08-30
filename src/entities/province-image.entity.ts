import {

    Entity,

    PrimaryGeneratedColumn,

    Column,

    ManyToOne,

    CreateDateColumn

} from "typeorm";


import {
    Province
} from "./province.entity";



@Entity("province_images")
export class ProvinceImage {


    @PrimaryGeneratedColumn()
    id!:number;



    @Column()
    image_url!:string;



    @ManyToOne(
        ()=>Province,
        province=>province.images,
        {
            onDelete:"CASCADE"
        }
    )
    province!:Province;



    @CreateDateColumn()
    created_at!:Date;

}