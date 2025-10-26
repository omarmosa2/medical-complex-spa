&lt;!DOCTYPE html&gt;
&lt;html lang=\"ar\" dir=\"rtl\"&gt;
&lt;head&gt;
    &lt;meta charset=\"UTF-8\"&gt;
    &lt;title&gt;تقرير المعاملات&lt;/title&gt;
    &lt;style&gt;
        body {
            font-family: 'DejaVu Sans', sans-serif;
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
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;تقرير المعاملات&lt;/h1&gt;
    &lt;table&gt;
        &lt;thead&gt;
            &lt;tr&gt;
                &lt;th&gt;المستخدم&lt;/th&gt;
                &lt;th&gt;النوع&lt;/th&gt;
                &lt;th&gt;المبلغ&lt;/th&gt;
                &lt;th&gt;الوصف&lt;/th&gt;
                &lt;th&gt;التاريخ&lt;/th&gt;
            &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
            @foreach ($transactions as $transaction)
                &lt;tr&gt;
                    &lt;td&gt;{{ $transaction-&gt;user-&gt;name }}&lt;/td&gt;
                    &lt;td&gt;{{ $transaction-&gt;type }}&lt;/td&gt;
                    &lt;td&gt;${{ number_format($transaction-&gt;amount, 2) }}&lt;/td&gt;
                    &lt;td&gt;{{ $transaction-&gt;description }}&lt;/td&gt;
                    &lt;td&gt;{{ $transaction-&gt;created_at-&gt;format('Y-m-d') }}&lt;/td&gt;
                &lt;/tr&gt;
            @endforeach
        &lt;/tbody&gt;
    &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;