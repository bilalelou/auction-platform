<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of email templates.
     */
    public function index(): JsonResponse
    {
        $templates = EmailTemplate::all();

        return response()->json([
            'data' => $templates,
        ]);
    }

    /**
     * Display the specified email template.
     */
    public function show(string $key): JsonResponse
    {
        $template = EmailTemplate::where('key', $key)->firstOrFail();

        return response()->json([
            'data' => $template,
        ]);
    }

    /**
     * Update the specified email template.
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $template = EmailTemplate::where('key', $key)->firstOrFail();

        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        $template->update($data);

        return response()->json([
            'data' => $template,
            'message' => 'Email template updated successfully',
        ]);
    }

    /**
     * Toggle template active status.
     */
    public function toggle(string $key): JsonResponse
    {
        $template = EmailTemplate::where('key', $key)->firstOrFail();
        
        $template->update([
            'is_active' => !$template->is_active,
        ]);

        return response()->json([
            'data' => $template,
            'message' => 'Template status updated successfully',
        ]);
    }
}
