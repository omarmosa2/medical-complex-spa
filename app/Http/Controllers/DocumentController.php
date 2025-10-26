<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        Document::create([
            'patient_id' => $request->patient_id,
            'uploaded_by_user_id' => auth()->id(),
            'title' => $request->title,
            'file_path' => $path,
        ]);

        return back();
    }

    public function destroy(Document $document)
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return back();
    }
}