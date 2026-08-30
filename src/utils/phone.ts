/*
    توحيد صيغة رقم الهاتف إلى الشكل الدولي: +963912345678

    - 00963… ⇒ +963…
    - 0912…  ⇒ +963912… (الرقم المحلي يُفترض سورياً)
    - +963…  ⇒ كما هو
    أي فواصل أو مسافات تُزال.
*/
export const DEFAULT_DIAL_CODE = "963";

export const normalizePhone = (
    raw: string
): string => {

    const digits =
        String(raw ?? "")
            .trim()
            .replace(/[\s\-().]/g, "");

    if (!digits) return "";

    if (digits.startsWith("+")) {
        return "+" + digits.slice(1).replace(/\D/g, "");
    }

    if (digits.startsWith("00")) {
        return "+" + digits.slice(2).replace(/\D/g, "");
    }

    const local = digits.replace(/\D/g, "");

    if (local.startsWith("0")) {
        return "+" + DEFAULT_DIAL_CODE + local.slice(1);
    }

    return "+" + local;
};

/*
    كل الصيغ التي قد يكون الرقم مخزّناً بها
    (حسابات قديمة حُفظت قبل التوحيد).
*/
export const phoneCandidates = (
    raw: string
): string[] => {

    const trimmed = String(raw ?? "").trim();
    const normalized = normalizePhone(trimmed);

    const set = new Set<string>([trimmed]);

    if (normalized) {
        set.add(normalized);
        set.add(normalized.slice(1));              // 963912…
        set.add("00" + normalized.slice(1));       // 00963912…

        if (normalized.startsWith("+" + DEFAULT_DIAL_CODE)) {
            set.add("0" + normalized.slice(DEFAULT_DIAL_CODE.length + 1)); // 0912…
        }
    }

    /*
        رقم مكتوب بلا صفر ولا رمز دولة (997980231) — نضيف صيغه
        بالرمز الافتراضي حتى يطابق الحساب المخزَّن بالصيغة الدولية.
    */

    const bare = trimmed.replace(/\D/g, "");

    if (bare && !trimmed.startsWith("+") && !bare.startsWith("0")) {

        set.add("+" + DEFAULT_DIAL_CODE + bare);
        set.add(DEFAULT_DIAL_CODE + bare);
        set.add("00" + DEFAULT_DIAL_CODE + bare);
        set.add("0" + bare);

    }

    return [...set].filter(Boolean);
};




/*
    الجزء الوطني من الرقم — ما يبقى بعد إسقاط رمز الدولة والأصفار البادئة.

    يُستخدم للبحث بلاحقة الرقم عند الدخول: المستخدم يكتب 997980231
    بينما الحساب مخزَّن كـ +963997980231، ولا نعرف دولته مسبقاً.
    البحث باللاحقة قد يطابق أكثر من حساب، لذلك يبقى تحقّق كلمة المرور
    هو الفاصل — لا يفتح الرقمُ وحده أي حساب.
*/

export const phoneNationalDigits = (
    raw: string
): string => {

    const digits =
        String(raw ?? "")
            .replace(/\D/g, "")
            .replace(/^0+/, "");

    return digits;
};
