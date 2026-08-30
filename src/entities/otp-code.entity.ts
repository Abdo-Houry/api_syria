import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index
} from "typeorm";



/*
    الغرض من الرمز.

    VERIFY_EMAIL   — تأكيد البريد بعد إنشاء الحساب
    RESET_PASSWORD — استعادة كلمة المرور المنسيّة
*/

export enum OtpPurpose {

    VERIFY_EMAIL = "VERIFY_EMAIL",

    RESET_PASSWORD = "RESET_PASSWORD"

}



/*
    رمز تحقّق لمرّة واحدة يُرسَل إلى البريد.

    الرمز نفسه لا يُخزَّن — نخزّن بصمته (bcrypt) كما نفعل مع كلمات المرور،
    فتسرّب قاعدة البيانات لا يكشف رموزاً صالحة.

    السجلات المستهلَكة أو المنتهية تبقى حتى التنظيف الدوري، ويتم تجاهلها
    عند التحقّق.
*/

@Entity("otp_codes")
export class OtpCode {


    @PrimaryGeneratedColumn()
    id!: number;



    @Index()
    @Column()
    email!: string;



    @Column({
        type: "enum",
        enum: OtpPurpose
    })
    purpose!: OtpPurpose;



    /* بصمة الرمز — لا الرمز نفسه. */

    @Column()
    code_hash!: string;



    @Column({
        type: "timestamp"
    })
    expires_at!: Date;



    /* عدد المحاولات الخاطئة — نقفل السجل بعد حدّ معيّن. */

    @Column({
        default: 0
    })
    attempts!: number;



    @Column({
        default: false
    })
    consumed!: boolean;



    @CreateDateColumn()
    created_at!: Date;


}
