import {

    Entity,

    PrimaryGeneratedColumn,

    Column,

    CreateDateColumn,

    UpdateDateColumn,

    DeleteDateColumn

} from "typeorm";
import { Translations } from "../types/translations";



@Entity("faqs")
export class FAQ {



    @PrimaryGeneratedColumn()
    id!: number;




    @Column()
    question!: string;



    @Column({
        type: "text"
    })
    answer!: string;



    @Column({
        default: true
    })
    status!: boolean;




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