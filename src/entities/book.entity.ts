import {

    Entity,

    PrimaryGeneratedColumn,

    Column,

    CreateDateColumn,

    UpdateDateColumn,

    DeleteDateColumn,

    ManyToOne,

    JoinColumn,

    ManyToMany,

    JoinTable,
    OneToMany

} from "typeorm";


import {
    Province
} from "./province.entity";


import {
    Place
} from "./place.entity";


import {
    Challenge
} from "./challenge.entity";


import {
    Stamp
} from "./stamp.entity";


import {
    Partner
} from "./partner.entity";
import { BookCopy } from "./book-copy.entity";
import { Translations } from "../types/translations";



@Entity("books")
export class Book {



    @PrimaryGeneratedColumn()
    id!: number;



    /*
      اسم الكتيب

      مثال:
      كتيب حلب السياحي
    */

    @Column()
    name!: string;



    @Column({
        type: "text",
        nullable: true
    })
    description?: string;




    @Column({
        default: true
    })
    status!: boolean;




    /*
       المحافظة التابعة للكتيب
    */

    @ManyToOne(
        () => Province,
        province => province.books,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "province_id"
    })
    province!: Province;




    /*
       الأماكن الموجودة داخل الكتيب
    */

    @ManyToMany(
        () => Place
    )
    @JoinTable({

        name: "book_places",

        joinColumn: {
            name: "book_id"
        },

        inverseJoinColumn: {
            name: "place_id"
        }

    })
    places!: Place[];





    /*
       التحديات الموجودة بالكتيب
    */

    @ManyToMany(
        () => Challenge
    )
    @JoinTable({

        name: "book_challenges",

        joinColumn: {
            name: "book_id"
        },

        inverseJoinColumn: {
            name: "challenge_id"
        }

    })
    challenges!: Challenge[];






    /*
       الطوابع الموجودة بالكتيب
    */

    @ManyToMany(
        () => Stamp
    )
    @JoinTable({

        name: "book_stamps",

        joinColumn: {
            name: "book_id"
        },

        inverseJoinColumn: {
            name: "stamp_id"
        }

    })
    stamps!: Stamp[];







    /*
       الشركاء الموجودون بالكتيب
    */

    @ManyToMany(
        () => Partner
    )
    @JoinTable({

        name: "book_partners",

        joinColumn: {
            name: "book_id"
        },

        inverseJoinColumn: {
            name: "partner_id"
        }

    })
    partners!: Partner[];


    @OneToMany(
        () => BookCopy,
        copy => copy.book
    )
    copies!: BookCopy[];






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