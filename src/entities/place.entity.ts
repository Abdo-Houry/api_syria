import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";


import {
    Province
} from "./province.entity";
import { PlaceImage } from "./place-image.entity";
import { PlaceVideo } from "./place-video.entity";
import { Challenge } from "./challenge.entity";
import { Stamp } from "./stamp.entity";
import { Book } from "./book.entity";
import { Area } from "./area.entity";
import { Translations } from "../types/translations";






@Entity("places")
export class Place {


    @PrimaryGeneratedColumn()
    id!: number;



    @Column()
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



    // معلومات الزيارة

    @Column({
        type: "text",
        nullable: true
    })
    visit_info?: string;



    /*
       بدون تحديد النوع كان TypeORM يستنتج integer
       فيفشل حفظ إحداثيات حقيقية مثل 36.1995.
    */

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



    /*
       مكان استكشاف: تعريفي بحت — تفاصيل ووسائط وموقع جغرافي فقط،
       بلا تحديات ولا طوابع ولا رمز QR. يظهر للمستخدم ضمن قائمة الأماكن
       نفسها، لكنه لا يُوثَّق كزيارة ولا يدخل في نسبة تقدّم الرحلة.
    */

    @Column({
        default: false
    })
    is_exploration!: boolean;



    @ManyToOne(
        () => Province,
        province => province.places,

        {
            onDelete: "CASCADE"
        }
    )
    province!: Province;

    /*
       المنطقة (اختيارية) — مثل «أبواب حلب» تجمع عدة أماكن.
    */
    @ManyToOne(
        () => Area,
        area => area.places,
        {
            nullable: true,
            onDelete: "SET NULL"
        }
    )
    area?: Area | null;





    @OneToMany(
        () => PlaceImage,
        image => image.place,
        {
            cascade: true
        }
    )
    images!: PlaceImage[];




    @OneToMany(
        () => PlaceVideo,
        video => video.place,
        {
            cascade: true
        }
    )
    videos!: PlaceVideo[];



    @OneToMany(
        () => Challenge,
        challenge => challenge.place,
        {
            cascade: true
        }
    )
    challenges!: Challenge[];


    @OneToMany(
        () => Stamp,
        stamp => stamp.place,
        {
            cascade: true
        }
    )
    stamps!: Stamp[];

    


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