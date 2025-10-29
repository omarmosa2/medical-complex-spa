<!doctype html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .section { border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .label { color: #666; min-width: 120px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; }
        th { background: #f5f5f5; }
    </style>
    <title>ملف المريض</title>
    </head>
<body>
    <div class="title">ملف المريض: {{ $patient->full_name }}</div>

    <div class="section">
        <div class="row"><span class="label">العمر:</span><span>{{ $patient->age }}</span></div>
        <div class="row"><span class="label">الجنس:</span><span>{{ $patient->gender === 'male' ? 'ذكر' : 'أنثى' }}</span></div>
        <div class="row"><span class="label">مكان الإقامة:</span><span>{{ $patient->residence }}</span></div>
        <div class="row"><span class="label">الهاتف:</span><span>{{ $patient->phone }}</span></div>
        <div class="row"><span class="label">الإيميل:</span><span>{{ $patient->email }}</span></div>
    </div>

    <div class="section">
        <div class="title">المواعيد</div>
        <table>
            <thead>
                <tr>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>الطبيب</th>
                    <th>الخدمة</th>
                    <th>الحالة</th>
                </tr>
            </thead>
            <tbody>
            @forelse($patient->appointments as $a)
                <tr>
                    <td>{{ $a->appointment_date }}</td>
                    <td>{{ $a->appointment_time }}</td>
                    <td>{{ optional($a->doctor->user)->name ?? $a->doctor->name }}</td>
                    <td>{{ optional($a->service)->name }}</td>
                    <td>{{ $a->status }}</td>
                </tr>
            @empty
                <tr><td colspan="5" style="text-align:center">لا توجد مواعيد</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="title">السجلات الطبية</div>
        <table>
            <thead>
                <tr>
                    <th>التاريخ</th>
                    <th>الطبيب</th>
                    <th>الملخص</th>
                </tr>
            </thead>
            <tbody>
            @forelse($patient->medicalRecords as $mr)
                <tr>
                    <td>{{ $mr->created_at }}</td>
                    <td>{{ optional($mr->doctor->user)->name ?? $mr->doctor->name }}</td>
                    <td>{{ $mr->summary ?? '-' }}</td>
                </tr>
            @empty
                <tr><td colspan="3" style="text-align:center">لا توجد سجلات</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="title">الوثائق</div>
        <table>
            <thead>
                <tr>
                    <th>العنوان</th>
                    <th>تاريخ الرفع</th>
                </tr>
            </thead>
            <tbody>
            @forelse($patient->documents as $doc)
                <tr>
                    <td>{{ $doc->title }}</td>
                    <td>{{ $doc->created_at }}</td>
                </tr>
            @empty
                <tr><td colspan="2" style="text-align:center">لا توجد وثائق</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>
</body>
</html>


