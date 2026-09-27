import bcrypt from "bcrypt";

import {
    randomInt
} from "crypto";

import {
    LessThan
} from "typeorm";

import {
    AppDataSource
} from "../config/database";

import {
    OtpCode,
    OtpPurpose
} from "../entities/otp-code.entity";

import {
    env
} from "../config/env";

import {
    ApiError
} from "../utils/api-error";



/* عدد المحاولات الخاطئة قبل إبطال الرمز. */
const MAX_ATTEMPTS = 5;



/*
    إدارة رموز التحقّق لمرّة واحدة.

    كل إصدار جديد يُبطل ما سبقه لنفس البريد والغرض، فلا يبقى إلا آخر رمز
    مرسَل صالحاً — وهو ما يتوقّعه المستخدم عند الضغط على «إعادة الإرسال».
*/

export class OtpService {


    private repository =
        AppDataSource.getRepository(OtpCode);




    /*
        رمز رقمي من ستّ خانات — أطول ما يُدخَل يدوياً براحة.

        المصدر `randomInt` من crypto لا `Math.random`: الأخير مولّد سريع
        لا سرّي، وحالته الداخلية تُستنتج من عدد قليل من مخرجاته، فيصبح
        الرمز التالي متوقَّعاً — ومن يتوقّع رمز غيره يدخل حسابه بلا حاجة
        إلى بريده. تهشير الرمز في القاعدة لا يقي من ذلك.
    */

    private generateCode(): string {

        return String(
            randomInt(100000, 1000000)
        );

    }




    private normalizeEmail(email: string) {

        return String(email ?? "").trim().toLowerCase();

    }




    /* ينشئ رمزاً جديداً ويعيده نصاً صريحاً — للإرسال بالبريد فقط. */

    async issue(
        email: string,
        purpose: OtpPurpose
    ): Promise<{ code: string; minutes: number }> {


        const target =
            this.normalizeEmail(email);



        /* إبطال كل الرموز السابقة لنفس البريد والغرض. */

        await this.repository.update(
            {
                email: target,
                purpose,
                consumed: false
            },
            {
                consumed: true
            }
        );



        const code =
            this.generateCode();


        const minutes =
            env.OTP_TTL_MINUTES;


        const expires =
            new Date(Date.now() + minutes * 60_000);



        await this.repository.save(
            this.repository.create({

                email: target,

                purpose,

                code_hash:
                    await bcrypt.hash(code, 10),

                expires_at: expires

            })
        );



        /* تنظيف السجلات المنتهية — لا داعي لمهمة دورية منفصلة. */

        await this.repository.delete({
            expires_at: LessThan(
                new Date(Date.now() - 24 * 60 * 60_000)
            )
        });



        return { code, minutes };


    }




    /*
        يتحقّق من الرمز ويستهلكه.
        يرمي ApiError برسالة معروفة للواجهة عند الفشل.
    */

    async consume(
        email: string,
        purpose: OtpPurpose,
        code: string
    ): Promise<void> {


        const target =
            this.normalizeEmail(email);


        const record =

            await this.repository.findOne({

                where: {
                    email: target,
                    purpose,
                    consumed: false
                },

                order: {
                    id: "DESC"
                }

            });



        if (!record) {

            throw new ApiError(
                400,
                "Verification code not found"
            );

        }



        if (record.expires_at.getTime() < Date.now()) {

            throw new ApiError(
                400,
                "Verification code expired"
            );

        }



        if (record.attempts >= MAX_ATTEMPTS) {

            /* الرمز أُحرق بمحاولات خاطئة — يلزم طلب رمز جديد. */

            record.consumed = true;

            await this.repository.save(record);


            throw new ApiError(
                400,
                "Too many attempts"
            );

        }



        const matched =

            await bcrypt.compare(
                String(code ?? "").trim(),
                record.code_hash
            );



        if (!matched) {

            record.attempts += 1;

            await this.repository.save(record);


            throw new ApiError(
                400,
                "Invalid verification code"
            );

        }



        record.consumed = true;

        await this.repository.save(record);


    }


}
