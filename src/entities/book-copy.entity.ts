import {
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm";


import {
    Book
} from "./book.entity";


import {
    QRCode
} from "./qr-code.entity";



/*
    التفرّد مركّب: (السيريال + الإصدار).

    السيريال وحده كان فريداً، فتعذّر طبع النسخة نفسها بإصدار جديد.
    الآن يُسمح بتكرار السيريال ما دام الإصدار مختلفاً، ويُمنع فقط
    عند تطابق الاثنين معاً.
*/

@Entity("book_copies")
@Unique("UQ_book_copy_serial_version", ["serial_number", "version"])
export class BookCopy {


    @PrimaryGeneratedColumn()
    id!: number;



    @ManyToOne(
        () => Book,
        book => book.copies,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "book_id"
    })
    book!: Book;




    /*
        رقم السيريال

        مثال:
        0001
    */

    @Column()
    serial_number!: string;




    /*
        إصدار الكتيب

        مثال:
        001
    */

    @Column()
    version!: string;



    /*
        هل تم بيع النسخة
    */

    @Column({
        default: false
    })
    is_sold!: boolean;




    /*
        هل تم إنشاء QR لها
    */

    @Column({
        default: false
    })
    qr_created!: boolean;




    /*
        ACTIVE
        SOLD
        BLOCKED
    */

    @Column({
        default: "ACTIVE"
    })
    status!: string;




    @OneToMany(
        () => QRCode,
        qr => qr.book_copy
    )
    qrs!: QRCode[];





    @CreateDateColumn()
    created_at!: Date;



    @UpdateDateColumn()
    updated_at!: Date;



    @DeleteDateColumn()
    deleted_at?: Date;


}