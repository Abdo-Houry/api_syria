# إصلاحات الباك اند

معالجة للمشاكل التي ظهرت أثناء ربط الواجهة واختبارها فعلياً مع الخادم وقاعدة
البيانات. جميعها مُتحقَّق منها بمجموعة فحوص انتهت بـ **19/19 ناجحة**.

---

## 1. تفعيل الكتيّب بالمسح

**المشكلة:** `POST /api/users/books` كان يقبل `bookCopyId` الرقمي فقط، بينما رمز
الـ QR يحمل `serial` و`version`، ولا توجد نقطة نهاية عامة تربط بينهما — فكان
التفعيل بالمسح مستحيلاً.

**الإصلاح:** أصبح المسار يقبل إحدى صيغتين:

```jsonc
{ "bookCopyId": 12 }                        // إدخال يدوي
{ "serial": "000001", "version": "001" }    // ما يحمله رمز الـ QR
```

وأصبح التفعيل **idempotent**: إعادة مسح كتيّب يملكه المستخدم تعيد الارتباط
الموجود بدل رمي خطأ «النسخة مباعة».

`src/validations/user-book.validation.ts` · `src/services/user-book.service.ts` ·
`src/controllers/user-book.controller.ts`

---

## 2. حلّ التحدي وجمع الطابع كانا يعيدان 500

**المشكلة:** `user_challenges.user_book_id` و`user_stamps.user_book_id` معرّفان
`nullable: false`، لكن `UserChallengeService.solve` و`UserStampService.collect`
كانا ينشئان السجل بدونهما ⇒ انتهاك NOT NULL ⇒ 500.

**الإصلاح:** أصبحت الخدمتان تحدّدان نسخة الكتيّب:

- من `userBookId` في جسم الطلب إن أُرسل (مع التحقّق من ملكيته للمستخدم)،
- وإلا تُستنتج من الكتيّب الذي يحتوي التحدي/الطابع ضمن كتيّبات المستخدم.

وتُرفض العملية بـ 403 إن لم ينتمِ التحدي أو الطابع إلى الكتيّب المحدّد، حتى لا
يُحتسب تقدّم في الرحلة الخطأ.

`src/services/user-challenge.service.ts` · `src/services/user-stamp.service.ts` ·
والتحققات والمتحكّمات المقابلة

---

## 3. `POST /api/books` كان يفشل عند إرفاق محتوى

**المشكلة:** `BookService.create` يستدعي `findBy({ id: data.placeIds })` بمصفوفة
دون `In(...)`، فينتج `invalid input syntax for type integer: "{"1","2"}"`.

**الإصلاح:** استخدام `In(ids)` مع تجاهل القوائم الفارغة.

`src/services/book.service.ts`

---

## 4. إحداثيات المكان كانت أعداداً صحيحة

**المشكلة:** `Place.latitude/longitude` بلا نوع صريح، فيستنتج TypeORM `integer`
ويفشل حفظ `36.1995` (بينما `Province` تستخدم `decimal` بشكل صحيح).

**الإصلاح:** `decimal(10,7)` كما في `Province`.

> مع `synchronize: true` سيغيّر TypeORM نوع العمودين تلقائياً عند الإقلاع.

`src/entities/place.entity.ts`

---

## 5. توكن المشرف بلا `role`

**المشكلة:** `AdminService.login` يوقّع `{id, username}`، بينما
`adminAuthMiddleware` يشترط `role === "ADMIN"` ⇒ `/book-copies/*` و`/admin/*`
كانت غير قابلة للاستخدام إطلاقاً.

**الإصلاح:** إضافة `role: "ADMIN"` إلى حمولة التوكن.

> على المشرفين تسجيل الدخول من جديد؛ التوكنات القديمة لا تحمل الدور.

`src/services/admin.service.ts`

---

## 6. `/uploads` لم يكن مُقدَّماً

**المشكلة:** لا `express.static` في `app.ts`، فالصور والفيديوهات المرفوعة لا
تُفتح رغم أن الخدمات تخزّن مسارها كـ `/uploads/...`.

**الإصلاح:** تقديم المجلد ثابتاً مع إنشائه إن لم يوجد، وضبط
`crossOriginResourcePolicy: "cross-origin"` في helmet لأن الواجهة تعمل على أصل
مختلف (5173) وكانت السياسة الافتراضية `same-origin` تحجب الوسائط.

`src/app.ts`

---

## 7. صلاحيات غير محكمة على المحتوى

**المشكلة:** `authMiddleware` كان يتحقّق من توقيع التوكن فقط دون الدور، فأي توكن
مستخدم يمرّ إلى مسارات إدارة المحتوى (إنشاء/تعديل/حذف المحافظات والأماكن
والتحديات…).

**الإصلاح:**

- `authMiddleware` أصبح **للمشرف فقط** (يشترط `role === "ADMIN"`).
- أُضيف `anyAuthMiddleware` يقبل المستخدم والمشرف، ويُستخدم على
  `GET /api/books/:id` وحده — لأنه مصدر محتوى الكتيّب الذي يحتاجه المستخدم.
- `GET /api/books` (قائمة كل الكتيّبات) بقيت للمشرف.

`src/middleware/auth.middleware.ts` · `src/routes/book.routes.ts`

---

## 8. أخطاء Zod كانت تصل كـ 500

**الإصلاح:** التقاط `ZodError` في `errorMiddleware` وإرجاع **400** برسالة تحدّد
الحقل، مع مصفوفة `errors` كاملة.

```json
{
  "success": false,
  "message": "name: Province name is required",
  "errors": [{ "field": "name", "message": "Province name is required" }]
}
```

`src/middleware/error.middleware.ts`

---

## إصلاحات إضافية ظهرت أثناء التحقّق

### إنشاء نسخة الكتيّب كان مكسوراً

`BookCopyService.create` كان يحفظ رموز الـ QR باسم علاقة خاطئ (`bookCopy` بدل
`book_copy`) و**بدون** `qr_value` رغم أنه عمود إلزامي وفريد ⇒ فشل الإدراج. أُصلح
الاسم، ويُبنى `qr_value` الآن عبر `buildQrValue`، وتُضبط `qr_created` بعد النجاح.

### `FRONTEND_URL` غير معرّف

روابط الـ QR كانت تُطبع بالبادئة `undefined/qr/...`. أُضيف `FRONTEND_URL` إلى
`config/env.ts` و`.env` (افتراضي `http://localhost:5173`)، وأُخرج بناء الرابط إلى
`utils/qr-generator.ts` ليُستخدم من الخدمتين معاً.

### عزل الرحلات على مستوى الخادم

`GET /users/visits` و`/users/challenges` و`/users/stamps` صارت تقبل
`?userBookId=` وتحصر النتائج في رحلة كتيّب واحد. هذا يغلق الحالة الحدّية التي كان
يظهر فيها المكان نفسه في كتيّبين فيُحتسب في كليهما.

### عدّاد الأماكن في لوحة الرحلة

`placesVisited` كان يعدّ كل سجلات `UserVisit` بما فيها زيارة المحافظة، فيضخّم
الرقم. أصبح يعدّ الأماكن المتمايزة فقط.

`src/services/user-dashboard.service.ts`

---

## ما لم يُغيَّر

`src/config/multer.ts` يعطي تحذير TypeScript (`TS1479`) لأن `uuid@14` حزمة ESM
فقط والمشروع CommonJS. الأمر يعمل وقت التشغيل على Node 22، وهو سابق لهذه
التعديلات، فتُرك كما هو.
