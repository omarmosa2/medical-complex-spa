<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return Auth::user()->unreadNotifications;
    }

    public function markAsRead(Request $request)
    {
        Auth::user()->unreadNotifications->where('id', $request->id)->markAsRead();
        return response()->noContent();
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return response()->noContent();
    }
}