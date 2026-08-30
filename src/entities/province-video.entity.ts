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



@Entity("province_videos")
export class ProvinceVideo {


    @PrimaryGeneratedColumn()
    id!:number;



    @Column()
    video_url!:string;



    @Column({
        nullable:true
    })
    title?:string;



    @ManyToOne(
        ()=>Province,
        province=>province.videos,
        {
            onDelete:"CASCADE"
        }
    )
    province!:Province;



    @CreateDateColumn()
    created_at!:Date;

}