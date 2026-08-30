import {
    ILike
} from "typeorm";


import {
    AppDataSource
} from "../config/database";


import {
    User
} from "../entities/user.entity";


import bcrypt from "bcrypt";


import {
    ApiError
} from "../utils/api-error";


import {
    generateToken
} from "../utils/jwt";
import {
    OtpService
} from "./otp.service";
import {
    MailService,
    isMailConfigured
} from "./mail.service";
import {
    OtpPurpose
} from "../entities/otp-code.entity";
import {
    normalizePhone,
    phoneCandidates,
    phoneNationalDigits
} from "../utils/phone";
import {
    In,
    Like
} from "typeorm";




export class UserAuthService {



    private repository =
        AppDataSource.getRepository(User);


    private otpService =
        new OtpService();


    private mailService =
        new MailService();




    /*
        يصدر رمزاً ويرسله بالبريد.

        فشل الإرسال يُبلَّغ عنه كخطأ خدمة صريح بدل تركه صامتاً — المستخدم
        ينتظر رسالة لن تصل، والأسوأ أن يظنّ الحساب جاهزاً وهو ليس كذلك.
    */

    private async sendCode(
        email: string,
        purpose: OtpPurpose
    ) {


        if (!isMailConfigured()) {

            throw new ApiError(
                503,
                "Email service unavailable"
            );

        }


        const { code, minutes } =
            await this.otpService.issue(email, purpose);


        try {

            if (purpose === OtpPurpose.VERIFY_EMAIL) {

                await this.mailService.sendVerificationCode(
                    email,
                    code,
                    minutes
                );

            } else {

                await this.mailService.sendPasswordResetCode(
                    email,
                    code,
                    minutes
                );

            }

        } catch {

            throw new ApiError(
                503,
                "Could not send verification email"
            );

        }


    }




    private issueSession(user: User) {

        return {

            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email
            },

            token: generateToken({
                id: user.id,
                role: "USER"
            })

        };

    }





    /*
        إنشاء الحساب.

        الحساب يُحفَظ فوراً لكن دون جلسة: البريد غير مؤكَّد بعد، ولا يُصدَر
        توكن إلا بعد إدخال الرمز في /users/verify-otp. هذا يمنع الحسابات
        ببريد لا يملكه صاحبها.
    */

    async register(data: any) {

        const phone =
            normalizePhone(data.phone);


        const email =
            String(data.email ?? "").trim().toLowerCase();


        const exists =
            await this.repository.findOne({
                where: {
                    phone: In(phoneCandidates(phone))
                }
            });



        if (exists) {

            throw new ApiError(
                400,
                "Phone already registered"
            );

        }




        const emailOwner =

            await this.repository.findOne({

                where: {
                    email
                }

            });



        if (emailOwner) {


            /*
                بريد لحساب لم يُؤكَّد بعد: نعيد استخدام السجل بدل رفضه —
                محاولة تسجيل ثانية بعد فشل وصول الرمز أمر شائع.
            */

            if (!emailOwner.email_verified) {


                emailOwner.name = data.name;

                emailOwner.phone = phone;

                emailOwner.password =
                    await bcrypt.hash(data.password, 10);


                await this.repository.save(emailOwner);


                await this.sendCode(
                    email,
                    OtpPurpose.VERIFY_EMAIL
                );


                return {

                    requiresVerification: true as const,

                    email

                };

            }


            throw new ApiError(
                400,
                "Email already registered"
            );


        }




        const hashedPassword =

            await bcrypt.hash(
                data.password,
                10
            );





        const user =

            this.repository.create({

                name: data.name,
                phone,
                email,

                email_verified: false,

                password: hashedPassword

            });





        await this.repository.save(user);




        await this.sendCode(
            email,
            OtpPurpose.VERIFY_EMAIL
        );




        return {

            requiresVerification: true as const,

            email

        };


    }








    /* تأكيد البريد بالرمز — هنا فقط تُفتح الجلسة. */

    async verifyEmail(data: any) {


        const email =
            String(data.email ?? "").trim().toLowerCase();


        const user =

            await this.repository.findOne({

                where: {
                    email
                }

            });



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }



        if (user.email_verified) {


            /* مؤكَّد مسبقاً — نفتح الجلسة بدل إظهار خطأ لا يفيد. */

            return this.issueSession(user);

        }



        await this.otpService.consume(
            email,
            OtpPurpose.VERIFY_EMAIL,
            data.code
        );



        user.email_verified = true;

        await this.repository.save(user);



        return this.issueSession(user);


    }








    /* إعادة إرسال رمز التأكيد. */

    async resendVerification(data: any) {


        const email =
            String(data.email ?? "").trim().toLowerCase();


        const user =

            await this.repository.findOne({

                where: {
                    email
                }

            });



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }



        if (user.email_verified) {

            throw new ApiError(
                400,
                "Email already verified"
            );

        }



        await this.sendCode(
            email,
            OtpPurpose.VERIFY_EMAIL
        );



        return { email };


    }








    /*
        طلب استعادة كلمة المرور.

        الاستجابة واحدة سواء وُجد البريد أم لا، حتى لا تتحوّل الصفحة إلى
        أداة لكشف البُرد المسجَّلة.
    */

    async forgotPassword(data: any) {


        const email =
            String(data.email ?? "").trim().toLowerCase();


        const user =

            await this.repository.findOne({

                where: {
                    email
                }

            });



        if (user) {

            await this.sendCode(
                email,
                OtpPurpose.RESET_PASSWORD
            );

        }



        return { email };


    }








    /* تعيين كلمة مرور جديدة بعد التحقّق من الرمز. */

    async resetPassword(data: any) {


        const email =
            String(data.email ?? "").trim().toLowerCase();


        const user =

            await this.repository.findOne({

                where: {
                    email
                }

            });



        /*
            التحقّق من الرمز يسبق التحقّق من وجود الحساب عمداً.

            لو رددنا "User not found" لبريد غير مسجَّل لأصبحت هذه النقطة
            كاشفةً للبُرد المسجَّلة، فتُبطل حرص forgot-password على عدم
            الكشف. لا رمز فعّال لبريد لم يُطلب له رمز، فالردّ واحد في
            الحالتين: رمز غير موجود.
        */

        await this.otpService.consume(
            email,
            OtpPurpose.RESET_PASSWORD,
            data.code
        );



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }



        user.password =
            await bcrypt.hash(data.password, 10);


        /* من ملك بريده فعلاً استحقّ تأكيده. */
        user.email_verified = true;


        await this.repository.save(user);



        return this.issueSession(user);


    }








    async login(data: any) {


        const identifier =
            String(data.phone ?? "").trim();


        /*
            الحقل يحمل رقم الهاتف أو الاسم.

            الاسم غير فريد، لذلك نجمع المطابقات ونختار من تطابق كلمةُ مروره
            بدل الاكتفاء بأول سجل — مطابقة الاسم وحدها لا تفتح أي حساب.
        */

        /* مطابقة باللاحقة — انظر التعليق في auth.service.ts */

        const national =
            phoneNationalDigits(identifier);


        const candidates =

            await this.repository.find({

                where: [
                    {
                        phone: In(phoneCandidates(identifier))
                    },
                    ...(national.length >= 6
                        ? [
                            {
                                phone: Like("%" + national)
                            }
                        ]
                        : []),
                    {
                        name: ILike(identifier)
                    }
                ],

                order: {
                    id: "ASC"
                }

            });




        let user: User | null = null;


        for (const candidate of candidates) {

            const matched =
                await bcrypt.compare(
                    data.password,
                    candidate.password
                );


            if (matched) {

                user = candidate;

                break;

            }

        }




        if (!user) {

            throw new ApiError(
                401,
                "Invalid phone or password"
            );

        }





        if (user.status === "BLOCKED") {

            throw new ApiError(
                403,
                "User blocked"
            );

        }



        /*
            حساب أُنشئ ولم يُؤكَّد بريده بعد: لا جلسة قبل الرمز.
            الواجهة تلتقط هذه الرسالة وتنقل المستخدم إلى شاشة التحقّق.
        */

        if (user.email_verified === false) {

            throw new ApiError(
                403,
                "Email not verified"
            );

        }




        const token =

            generateToken({

                id: user.id,

                role: "USER"

            });





        return {

            user: {
                id: user.id,
                name: user.name,
                phone: user.phone
            },

            token

        };


    }




}