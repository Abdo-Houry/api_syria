import {

    Entity,

    PrimaryGeneratedColumn,

    Column,

    CreateDateColumn,

    UpdateDateColumn,

    DeleteDateColumn,

    ManyToOne,
    ManyToMany

} from "typeorm";


import {
    Place
} from "./place.entity";
import { Book } from "./book.entity";
import { Translations } from "../types/translations";



@Entity("stamps")
export class Stamp {



    @PrimaryGeneratedColumn()
    id!: number;



    @Column()
    name!: string;



    @Column({
        type: "text",
        nullable: true
    })
    description?: string;



    @Column()
    image_url!: string;



    @Column({
        default: true
    })
    status!: boolean;




    @ManyToOne(
        () => Place,
        place => place.stamps,
        {
            onDelete: "CASCADE"
        }
    )
    place!: Place;
    

    @ManyToMany(
        () => Book
    )
    books!: Book[];




    /*
       ترجمات باقي اللغات (en/de/tr).
       العربية تبقى في الأعمدة الأصلية وتُستخدم كاحتياط.
    */

    @Column({
        type: "jsonb",
        nullable: true
    })
    translations?: Translations;



    @CreateDateColumn()
    created_at!: Date;



    @UpdateDateColumn()
    updated_at!: Date;



    @DeleteDateColumn()
    deleted_at?: Date;


}