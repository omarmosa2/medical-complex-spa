<?php

namespace App\Http\Controllers;

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
         $this->authorize('viewAny', MedicalRecordTemplate::class);
         if (auth()->user()->role === 'admin') {
             $templates = MedicalRecordTemplate::all();
         } else {
             $templates = MedicalRecordTemplate::where('user_id', auth()->id())->get();
         }
         return Inertia::render('MedicalRecordTemplates/Index', [
             'templates' => $templates
         ]);
     }

    /**
      * Show the form for creating a new resource.
      */
    public function create()
    {
         $this->authorize('create', MedicalRecordTemplate::class);
         return Inertia::render('MedicalRecordTemplates/Create');
     }

    /**
      * Store a newly created resource in storage.
      */
    public function store(Request $request)
    {
         $this->authorize('create', MedicalRecordTemplate::class);
         $validated = $request->validate([
             'title' => 'required|string|max:255',
             'content' => 'required|array',
             'content.diagnosis' => 'nullable|string',
             'content.prescription' => 'nullable|string',
             'content.notes' => 'nullable|string',
         ]);

         $validated['user_id'] = auth()->id();
         MedicalRecordTemplate::create($validated);

         return redirect()->route('medical-record-templates.index');
     }

    /**
      * Display the specified resource.
      */
    public function show(MedicalRecordTemplate $medicalRecordTemplate)
    {
         $this->authorize('view', $medicalRecordTemplate);
         return Inertia::render('MedicalRecordTemplates/Show', [
             'template' => $medicalRecordTemplate
         ]);
     }

     /**
      * Show the form for editing the specified resource.
      */
    public function edit(MedicalRecordTemplate $medicalRecordTemplate)
    {
         $this->authorize('update', $medicalRecordTemplate);
         return Inertia::render('MedicalRecordTemplates/Edit', [
             'template' => $medicalRecordTemplate
         ]);
     }

     /**
      * Update the specified resource in storage.
      */
    public function update(Request $request, MedicalRecordTemplate $medicalRecordTemplate)
    {
         $this->authorize('update', $medicalRecordTemplate);
         $validated = $request->validate([
             'title' => 'required|string|max:255',
             'content' => 'required|array',
             'content.diagnosis' => 'nullable|string',
             'content.prescription' => 'nullable|string',
             'content.notes' => 'nullable|string',
         ]);

         $medicalRecordTemplate->update($validated);

         return redirect()->route('medical-record-templates.index');
     }

     /**
      * Remove the specified resource from storage.
      */
    public function destroy(MedicalRecordTemplate $medicalRecordTemplate)
    {
         $this->authorize('delete', $medicalRecordTemplate);
         $medicalRecordTemplate->delete();

         return redirect()->route('medical-record-templates.index');
     }
}
