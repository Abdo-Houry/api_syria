import "reflect-metadata";

import { DataSource } from "typeorm";

import { env } from "./env";


/*
    الكيانات تُستورد كأصناف صريحة لا كنمط مسارات.

    النمط "src/entities/*" كان يُحلّ وقت التشغيل نسبةً إلى مجلّد التشغيل،
    فيعمل مع ts-node في التطوير ويفشل بعد البناء: `node dist/server.js`
    يبقى يبحث في src/ عن ملفات .ts لا يعرف كيف يقرأها، فلا يُحمَّل أي كيان
    ولا يُفتح المنفذ. الاستيراد الصريح يُحلّ وقت الترجمة فيعمل في الحالتين،
    وأي كيان يُحذف أو يُعاد تسميته يكسر البناء فوراً بدل أن يظهر في الإنتاج.
*/

import { Admin } from "../entities/admin.entity";
import { Area } from "../entities/area.entity";
import { Book } from "../entities/book.entity";
import { BookCopy } from "../entities/book-copy.entity";
import { Challenge } from "../entities/challenge.entity";
import { FAQ } from "../entities/faq.entity";
import { OtpCode } from "../entities/otp-code.entity";
import { Partner } from "../entities/partner.entity";
import { Place } from "../entities/place.entity";
import { PlaceImage } from "../entities/place-image.entity";
import { PlaceVideo } from "../entities/place-video.entity";
import { Province } from "../entities/province.entity";
import { ProvinceImage } from "../entities/province-image.entity";
import { ProvinceVideo } from "../entities/province-video.entity";
import { QRCode } from "../entities/qr-code.entity";
import { Stamp } from "../entities/stamp.entity";
import { User } from "../entities/user.entity";
import { UserBook } from "../entities/user-book.entity";
import { UserChallenge } from "../entities/user-challenge.entity";
import { UserStamp } from "../entities/user-stamp.entity";
import { UserVisit } from "../entities/user-visit.entity";


export const AppDataSource =
    new DataSource({

        type: "postgres",

        host: env.DB_HOST,

        port: env.DB_PORT,

        username: env.DB_USERNAME,

        password: env.DB_PASSWORD,

        database: env.DB_NAME,


        /*
            مزامنة البنية تلقائياً من الكيانات.

            مريحة في التطوير، وخطرة على قاعدة فيها بيانات مستخدمين: إعادة
            تسمية عمود تُقرأ كعمود محذوف وآخر جديد، فيُمسح محتواه بلا سؤال
            ولا تراجع. لذلك تبقى مطفأة في الإنتاج، وتُشعَل يدوياً مرّة واحدة
            عبر DB_SYNCHRONIZE=true لإنشاء الجداول في أول نشر ثم تُطفأ.
        */

        synchronize: env.DB_SYNCHRONIZE,

        logging: false,

        entities: [

            Admin,
            Area,
            Book,
            BookCopy,
            Challenge,
            FAQ,
            OtpCode,
            Partner,
            Place,
            PlaceImage,
            PlaceVideo,
            Province,
            ProvinceImage,
            ProvinceVideo,
            QRCode,
            Stamp,
            User,
            UserBook,
            UserChallenge,
            UserStamp,
            UserVisit

        ]

    });
