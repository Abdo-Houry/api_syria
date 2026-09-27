import {
    Request,
    Response
} from "express";

import rateLimit from "express-rate-limit";


/* ردّ موحّد عند تجاوز الحدّ — بنفس مغلّف الاستجابة المستعمل في المشروع. */

const tooMany = (message: string) =>

    (_req: Request, res: Response) => {

        res.status(429).json({

            success: false,

            message

        });

    };




/*
    تحديد معدّل محاولات الدخول.

    بلا حدّ، يستطيع برنامج تجربة كلمات المرور بلا توقّف: bcrypt يستهلك نحو
    عُشر ثانية من المعالج لكل محاولة، فالتجربة المتواصلة تخمّن كلمات المرور
    الضعيفة وتُثقل الخادم على كل المستخدمين في الوقت نفسه.

    العدّ بعنوان الـ IP، والمحاولة الناجحة لا تُحتسب — فالمستخدم الذي يدخل
    بشكل طبيعي لا يقترب من الحدّ أصلاً. الحظر مؤقّت: ينتهي وحده بانقضاء
    النافذة، ولا يمسّ الحساب نفسه.
*/

export const loginRateLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 5,

    /* الدخول الناجح لا يستهلك الرصيد. */
    skipSuccessfulRequests: true,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    handler: tooMany("Too many login attempts")

});




/*
    تحديد معدّل إرسال رموز التحقّق.

    كل نداء لهذه المسارات يُرسل بريداً من حساب واحد، فبلا حدّ يستطيع أي
    شخص أن يجعل الخادم يقصف عنواناً بالرسائل، أو أن يستنفد حصّة الإرسال
    اليومية فيتوقّف التحقّق عن المستخدمين جميعاً.

    حدّان معاً: حدّ على البريد الواحد يحمي صاحبه من القصف، وحدّ على الـ IP
    يحدّ من مهاجم يوزّع طلباته على عناوين كثيرة.
*/

export const otpEmailRateLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    limit: 5,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    /* المفتاح هو البريد المقصود — لا عنوان المرسِل. */
    keyGenerator: (req: Request) =>
        String(req.body?.email ?? "").trim().toLowerCase() || "unknown",

    /* الطلب بلا بريد يتركه التحقّق يفشل بـ 400، فلا معنى لاحتسابه. */
    skip: (req: Request) => !req.body?.email,

    handler: tooMany("Too many verification emails")

});


export const otpIpRateLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    /*
       سخيّ عمداً: زوّار كثر خلف شبكة واحدة (فندق، مقهى، مجموعة سياحية)
       يشتركون في عنوان واحد، والحدّ الضيّق كان سيمنعهم من التسجيل.
    */
    limit: 30,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    handler: tooMany("Too many verification emails")

});
