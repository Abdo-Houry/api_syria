import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn
} from "typeorm";


import {
    Place
} from "./place.entity";



@Entity("place_videos")
export class PlaceVideo {


    @PrimaryGeneratedColumn()
    id!: number;



    @Column()
    video_url!: string;



    @Column({
        nullable: true
    })
    title?: string;



    @ManyToOne(
        () => Place,
        place => place.videos,
        {
            onDelete: "CASCADE"
        }
    )
    place!: Place;



    @CreateDateColumn()
    created_at!: Date;

}