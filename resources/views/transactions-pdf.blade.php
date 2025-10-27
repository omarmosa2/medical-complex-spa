<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="utf-8">
    <title>تقرير المعاملات</title>
    <style>
        body {
            font-family: 'Noto Sans Arabic', sans-serif;
            text-align: right;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>تقرير المعاملات</h1>
    <table>
        <thead>
            <tr>
                <th>الرقم</th>
                <th>المستخدم</th>
                <th>المبلغ</th>
                <th>طريقة الدفع</th>
                <th>رقم المعاملة</th>
                <th>التاريخ</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $transaction)
                <tr>
                    <td>{{ $transaction->id }}</td>
                    <td>{{ $transaction->user->name }}</td>
                    <td>${{ number_format($transaction->amount, 2) }}</td>
                    <td>{{ $transaction->payment_method }}</td>
                    <td>{{ $transaction->transaction_id ?: 'N/A' }}</td>
                    <td>{{ $transaction->created_at->format('Y-m-d') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>