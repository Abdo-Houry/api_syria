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



@Entity("place_images")
export class PlaceImage {


    @PrimaryGeneratedColumn()
    id!: number;



    @Column()
    image_url!: string;



    @ManyToOne(
        () => Place,
        place => place.images,
        {
            onDelete: "CASCADE"
        }
    )
    place!: Place;



    @CreateDateColumn()
    created_at!: Date;

}