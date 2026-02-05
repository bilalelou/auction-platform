<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) env('ADMIN_TOKEN', '');

        if ($expected === '') {
            return response()->json([
                'message' => 'Admin token is not configured on the server.',
            ], 500);
        }

        $provided = (string) $request->header('X-Admin-Token', '');

        if (! hash_equals($expected, $provided)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 401);
        }

        return $next($request);
    }
}