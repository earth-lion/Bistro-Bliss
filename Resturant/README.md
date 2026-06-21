# Restaurant API (Laravel)

تطبيق REST API لمطعم بسيط يعتمد Laravel 12 وSanctum لتسجيل الدخول وصلاحيات الأدمن.

## المميزات

- تسجيل دخول وتسجيل مستخدمين.
- صلاحيات `admin` للوصول إلى إدارة المستخدمين المنيو الحجوزات والطلبات.
- عرض تصنيفات الطعام وعناصر المنيو العامة.
- حجز طاولات للمستخدمين.
- إنشاء طلبات شراء أونلاين مع تفاصيل السلة.
- إدارة حالة الحجز والطلب للأدمن.
- استخدام `paginate(15)` للـ endpoints التي تعرض مجموعات كبيرة.

## كيفية التشغيل

1. ثبت التبعيات:

```bash
composer install
```

2. أنسخ ملف الإعدادات وأنشئ مفتاح التطبيق:

```bash
copy .env.example .env
php artisan key:generate
```

3. شغل الميجرايشنز:

```bash
php artisan migrate
```

4. شغل الخادم:

```bash
php artisan serve
```
```

## نقاط مهمة

- واجهة الـ API موجودة في `routes/api.php`.
- الحماية بالمصادقة عبر `sanctum`.
- مسارات الأدمن تحت `/api/admin` وتستخدم middleware `admin`.
- حقل `phone` في تحديث البروفايل أصبح اختياري.

## Endpoints أساسية

- `GET /api/menu`
- `GET /api/categories`
- `GET /api/profile`
- `PUT /api/profile/update`
- `POST /api/bookings`
- `GET /api/my-bookings`
- `POST /api/orders`
- `GET /api/my-orders`
- `POST /api/admin/menu`
- `PATCH /api/admin/menu/{id}`
- `DELETE /api/admin/menu/{id}`
- `POST /api/admin/categories`
- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/{id}/status`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/{id}/status`
