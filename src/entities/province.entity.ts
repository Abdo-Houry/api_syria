import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";

import {
    Place
} from "./place.entity";

import {
    ProvinceImage
} from "./province-image.entity";


import {
    ProvinceVideo
} from "./province-video.entity";
import { Book } from "./book.entity";
import { Translations } from "../types/translations";



@Entity("provinces")
export class Province {


    @PrimaryGeneratedColumn()
    id!: number;



    @Column({
        unique: true
    })
    name!: string;



    @Column({
        type: "text",
        nullable: true
    })
    summary?: string;



    @Column({
        type: "text",
        nullable: true
    })
    description?: string;



    @Column({
        type: "decimal",
        precision: 10,
        scale: 7,
        nullable: true
    })
    latitude?: number;



    @Column({
        type: "decimal",
        precision: 10,
        scale: 7,
        nullable: true
    })
    longitude?: number;



    @Column({
        default: true
    })
    status!: boolean;



    @OneToMany(
        () => ProvinceImage,
        image => image.province,
        {
            cascade: true
        }
    )
    images!: ProvinceImage[];



    @OneToMany(
        () => ProvinceVideo,
        video => video.province,
        {
            cascade: true
        }
    )
    videos!: ProvinceVideo[];


    @OneToMany(
        () => Place,
        place => place.province,
        {
            cascade: true
        }
    )
    places!: Place[];

    @OneToMany(
        () => Book,
        book => book.province
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