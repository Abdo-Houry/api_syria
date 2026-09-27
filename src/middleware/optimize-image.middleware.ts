import {
    Request,
    Response,
    NextFunction
} from "express";

import path from "path";

import fs from "fs/promises";

import sharp from "sharp";


/*
    ضغط الصور المرفوعة بعد حفظها مباشرة.

    الصورة كانت تُحفَظ وتُعرَض بحجمها الأصلي: صورة من كاميرا هاتف (ثمانية
    ميغابايت بعرض أربعة آلاف بكسل) تُرسَل كما هي لتُعرض في بطاقة عرضها
    ثلاثمئة بكسل على شاشة زائر. صفحة فيها ستّة أماكن كانت تعني عشرات
    الميغابايتات — وهو ما لا يُفتح أصلاً على إنترنت موقع سياحي.

    تُعاد الكتابة إلى webp بعرض يكفي أكبر شاشة يُعرض عليها الملف فعلاً،
    فينزل الحجم إلى جزء من أربعين تقريباً بلا فرق منظور.
*/


/** أقصى عرض لكل نوع محتوى — مشتقّ من المكان الذي تُعرض فيه الصورة. */
const MAX_WIDTH: Record<string, number> = {
    places: 1600,
    provinces: 1600,
    stamps: 800,
    partners: 800,
    users: 512,
    misc: 1600
};


/*
   الصيغ التي تُعاد كتابتها. تُستثنى svg لأنها متجهة أصلاً وحجمها ضئيل،
   وgif لأن إعادة ترميزها تُفقد الحركة.
*/
const REWRITABLE = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif"
]);


const widthFor = (filePath: string): number => {

    const folder =
        path.basename(path.dirname(filePath));

    return MAX_WIDTH[folder] ?? MAX_WIDTH.misc;

};




/** يضغط ملفاً واحداً ويحدّث اسمه ومساره في الطلب. */
const optimize = async (file: Express.Multer.File): Promise<void> => {

    if (!REWRITABLE.has(file.mimetype)) return;


    const source = file.path;

    const target =
        path.join(
            path.dirname(source),
            path.basename(source, path.extname(source)) + ".webp"
        );


    /*
       withoutEnlargement: الصورة الأصغر من الحدّ تبقى بمقاسها ولا تُكبَّر.
       rotate بلا وسيط: يطبّق دوران EXIF ثم يُسقطه — بدونه تظهر صور الهواتف
       مقلوبة بعد إعادة الترميز.
    */
    const output =
        await sharp(source)
            .rotate()
            .resize({
                width: widthFor(source),
                withoutEnlargement: true
            })
            .webp({ quality: 78 })
            .toBuffer();


    await fs.writeFile(target, output);


    /* الأصل لم يعد مطلوباً — النسخة المضغوطة هي ما يُخزَّن مساره. */
    if (target !== source) {

        await fs.unlink(source).catch(() => undefined);

    }


    file.filename = path.basename(target);

    file.path = target;

    file.mimetype = "image/webp";

    file.size = output.length;

};




/**
 * يوضع بعد multer مباشرة في كل مسار رفع.
 *
 * الفشل لا يُسقط الطلب: إن تعذّر ضغط صورة تبقى نسختها الأصلية وتُحفَظ
 * كما هي — رفعٌ ثقيل أهون على المستخدم من رفعٍ فاشل.
 */
export const optimizeImages = async (

    req: Request,

    res: Response,

    next: NextFunction

) => {

    const files: Express.Multer.File[] = [];

    if (req.file) files.push(req.file);

    if (Array.isArray(req.files)) files.push(...req.files);


    for (const file of files) {

        try {

            await optimize(file);

        } catch (error) {

            console.error(
                "Image optimization failed for " + file.originalname,
                error
            );

        }

    }


    next();

};
