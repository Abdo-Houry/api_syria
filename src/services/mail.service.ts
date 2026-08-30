import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../config/env";



/*
    إرسال البريد عبر Gmail بكلمة مرور التطبيقات (App Password).

    الناقل يُنشأ مرّة واحدة كسولاً: إنشاؤه عند الإقلاع يجعل الخادم يفشل
    في بيئة بلا بريد مضبوط، بينما التطبيق يعمل تماماً دون بريد ما لم
    يُطلب إرسال رمز.
*/

let transporter: Transporter | null = null;


export const isMailConfigured = () =>
    Boolean(env.MAIL_USER && env.MAIL_PASSWORD);


function getTransporter(): Transporter {

    if (!isMailConfigured()) {

        throw new Error(
            "Mail is not configured: set MAIL_USER and MAIL_PASSWORD"
        );

    }

    transporter ??= nodemailer.createTransport({

        service: "gmail",

        auth: {
            user: env.MAIL_USER,
            pass: env.MAIL_PASSWORD
        }

    });

    return transporter;

}




interface MailPayload {

    to: string;

    subject: string;

    html: string;

    text: string;

}



async function send(payload: MailPayload) {

    await getTransporter().sendMail({

        from: env.MAIL_FROM || env.MAIL_USER,

        to: payload.to,

        subject: payload.subject,

        text: payload.text,

        html: payload.html

    });

}




/*
    قالب موحّد للرسائل — عربي واتجاه RTL، وألوان العلامة.
    البريد لا يدعم CSS خارجياً، لذلك الأنماط مضمّنة داخل الوسوم.
*/

function template(
    title: string,
    intro: string,
    code: string,
    note: string
) {

    return `
<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#f6f1e7;padding:28px">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid rgba(20,32,28,.08)">
    <div style="background:#14201c;padding:20px 24px">
      <span style="color:#d9a441;font-size:22px;font-weight:bold">صك</span>
    </div>
    <div style="padding:26px 24px;color:#1d2a25">
      <h1 style="margin:0 0 12px;font-size:19px">${title}</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.9;color:#41524b">${intro}</p>
      <div style="text-align:center;margin:0 0 20px">
        <span style="display:inline-block;letter-spacing:10px;font-size:30px;font-weight:bold;color:#14201c;background:#f6f1e7;border:1px solid rgba(217,164,65,.5);border-radius:14px;padding:14px 22px">${code}</span>
      </div>
      <p style="margin:0;font-size:12.5px;line-height:1.9;color:#6b7a73">${note}</p>
    </div>
    <div style="background:#f6f1e7;padding:14px 24px;font-size:11.5px;color:#6b7a73;text-align:center">
      إن لم تطلب هذه الرسالة فتجاهلها — لن يتغيّر شيء في حسابك.
    </div>
  </div>
</div>`;

}




export class MailService {


    /* رمز تأكيد البريد بعد إنشاء الحساب. */

    async sendVerificationCode(
        to: string,
        code: string,
        minutes: number
    ) {

        await send({

            to,

            subject: `رمز تفعيل حسابك في صك: ${code}`,

            text:
                `رمز تفعيل حسابك في صك هو ${code}. ` +
                `الرمز صالح لمدة ${minutes} دقيقة.`,

            html: template(
                "أهلاً بك في صك",
                "لتفعيل حسابك أدخل رمز التحقّق التالي في التطبيق:",
                code,
                `الرمز صالح لمدة ${minutes} دقيقة، ولمرّة واحدة فقط.`
            )

        });

    }




    /* رمز استعادة كلمة المرور. */

    async sendPasswordResetCode(
        to: string,
        code: string,
        minutes: number
    ) {

        await send({

            to,

            subject: `رمز استعادة كلمة المرور في صك: ${code}`,

            text:
                `رمز استعادة كلمة المرور في صك هو ${code}. ` +
                `الرمز صالح لمدة ${minutes} دقيقة.`,

            html: template(
                "استعادة كلمة المرور",
                "طلبت إعادة تعيين كلمة مرور حسابك. أدخل الرمز التالي لمتابعة الاستعادة:",
                code,
                `الرمز صالح لمدة ${minutes} دقيقة، ولمرّة واحدة فقط.`
            )

        });

    }


}
