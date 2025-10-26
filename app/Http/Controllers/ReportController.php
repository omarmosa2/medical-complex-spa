<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Transaction;
use App\Exports\TransactionsExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index()
    {
        $totalRevenue = Payment::sum('amount');
        $totalAppointments = Appointment::count();
        $totalPatients = Patient::count();
        $transactions = Transaction::with('user')->latest()->take(10)->get();

        return Inertia::render('Reports/Index', [
            'totalRevenue' => $totalRevenue,
            'totalAppointments' => $totalAppointments,
            'totalPatients' => $totalPatients,
            'transactions' => $transactions,
        ]);
    }

    public function export()
    {
        return Excel::download(new TransactionsExport, 'transactions.xlsx');
    }

    public function exportPdf()
    {
        $transactions = Transaction::with('user')->get();
        $pdf = Pdf::loadView('transactions-pdf', ['transactions' => $transactions]);
        return $pdf->download('transactions.pdf');
    }
}