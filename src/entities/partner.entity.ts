import {

    Entity,

    PrimaryGeneratedColumn,

    Column,

    CreateDateColumn,

    UpdateDateColumn,

    DeleteDateColumn,
    ManyToMany

} from "typeorm";
import { Book } from "./book.entity";
import { Translations } from "../types/translations";



@Entity("partners")
export class Partner {



    @PrimaryGeneratedColumn()
    id!: number;




    @Column()
    name!: string;



    @Column({
        type: "text",
        nullable: true
    })
    description?: string;



    // صورة الشريك أو الشعار

    @Column()
    image_url!: string;




    // نسبة الخصم

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        default: 0
    })
    discount_percentage!: number;




    @Column({
        default: true
    })
    status!: boolean;


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