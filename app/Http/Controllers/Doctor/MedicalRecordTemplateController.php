<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecordTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalRecordTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('MedicalRecordTemplates/Index', [
            'templates' => MedicalRecordTemplate::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MedicalRecordTemplates/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|array',
        ]);

        MedicalRecordTemplate::create($request->all());

        return redirect()->route('medical-record-templates.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('MedicalRecordTemplates/Edit', [
            'template' => MedicalRecordTemplate::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|array',
        ]);

        $template = MedicalRecordTemplate::findOrFail($id);
        $template->update($request->all());

        return redirect()->route('medical-record-templates.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $template = MedicalRecordTemplate::findOrFail($id);
        $template->delete();

        return redirect()->back();
    }
}