<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Setting::class);
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Settings/Index', ['settings' => $settings]);
    }

    public function store(Request $request)
    {
        $this->authorize('update', Setting::class);

        $validatedData = $request->validate([
            'app_name' => 'nullable|string|max:255',
            'default_currency' => 'nullable|string|max:3',
        ]);

        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}