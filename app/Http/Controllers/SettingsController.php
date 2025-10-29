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
            'logo' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);
 
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $imageName = time().'.'.$image->extension();
            $image->move(public_path('images'), $imageName);
            $validatedData['logo'] = $imageName;
        }

        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}