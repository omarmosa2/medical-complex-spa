<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TransactionsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Transaction::with('user')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'User',
            'Amount',
            'Payment Method',
            'Transaction ID',
            'Created At',
            'Updated At',
        ];
    }
}
