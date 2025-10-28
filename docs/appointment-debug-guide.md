# دليل استكشاف أخطاء صفحة إضافة الموعد

## المشاكل المحتملة والحلول:

### 1. الروت لا يعمل
**المشكلة:** قد لا يكون الروت `patients/{id}/data` مُسجل بشكل صحيح
**الحل:** تأكد من الروت في `routes/web.php`

### 2. API endpoint لا يعمل
**المشكلة:** قد يكون هناك خطأ في `PatientController::getPatientData()`
**الحل:** تأكد من استعلام قاعدة البيانات وترقيم البيانات

### 3. الصفحة لا تحمل البيانات
**المشكلة:** قد لا تكون البيانات مُرسلة من `AppointmentController::create()`
**الحل:** تأكد من أن البيانات مُرسلة في استجابة Inertia

### 4. أخطاء TypeScript
**المشكلة:** قد تكون هناك أخطاء في الأنواع (types)
**الحل:** تأكد من تطابق الأنواع مع البيانات المُرسلة

## خطوات الفحص:

1. فحص الروت: `php artisan route:list | grep patients`
2. فحص قاعدة البيانات: التأكد من وجود بيانات المرضى
3. فحص Console المتصفح: للبحث عن أخطاء JavaScript
4. فحص Network Tab: للتأكد من API calls

## الاختبار السريع:

```bash
# فحص الروت
php artisan route:list | grep patients

# فحص بيانات المرضى
php artisan tinker
> \App\Models\Patient::count()
> \App\Models\Patient::first()