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



@Entity("challenges")
export class Challenge {



    @PrimaryGeneratedColumn()
    id!: number;




    @Column()
    title!: string;



    @Column({
        type: "text",
        nullable: true
    })
    description?: string;



    /*
      نوع التحدي

      example:
      question
      visit
      photo
      discovery

    */
    @Column({
        default: "discovery"
    })
    type!: string;




    /*
       خيارات الإجابة (اختيار من متعدد) ودليل الإجابة الصحيحة.
       التحديات القديمة بلا خيارات تقبل إجابة حرّة.
    */
    @Column({
        type: "jsonb",
        nullable: true
    })
    options?: string[] | null;



    @Column({
        type: "int",
        nullable: true
    })
    correct_option?: number | null;



    @Column({
        default: true
    })
    status!: boolean;




    @ManyToOne(
        () => Place,
        place => place.challenges,
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