import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";
import { UserBook } from "./user-book.entity";
import { UserVisit } from "./user-visit.entity";
import { UserChallenge } from "./user-challenge.entity";
import { UserStamp } from "./user-stamp.entity";




@Entity("users")
export class User {


    @PrimaryGeneratedColumn()
    id!: number;



    @Column()
    name!: string;



    @Column({
        unique: true
    })
    phone!: string;



    @Column({
        nullable: true,
        unique: true
    })
    email?: string;



    /*
        هل أُكِّد البريد برمز التحقّق؟

        القيمة الافتراضية true عمداً: الحسابات التي أُنشئت قبل تفعيل
        التحقّق تبقى قادرة على الدخول. التسجيل الجديد يضبطها false
        صراحةً، فلا يكتمل إلا بعد إدخال الرمز.
    */

    @Column({
        default: true
    })
    email_verified!: boolean;



    @Column()
    password!: string;



    @Column({
        nullable: true
    })
    image?: string;



    /*
        ACTIVE
        BLOCKED
    */

    @Column({
        default: "ACTIVE"
    })
    status!: string;




    @OneToMany(
        () => UserBook,
        userBook => userBook.user
    )
    books!: UserBook[];



    @OneToMany(
        () => UserVisit,
        visit => visit.user
    )
    visits!: UserVisit[];


    @OneToMany(
        () => UserChallenge,
        challenge => challenge.user
    )
    challenges!: UserChallenge[];

    @OneToMany(
        () => UserStamp,
        stamp => stamp.user
    )
    stamps!: UserStamp[];


    @CreateDateColumn()
    created_at!: Date;



    @UpdateDateColumn()
    updated_at!: Date;



    @DeleteDateColumn()
    deleted_at?: Date;


}