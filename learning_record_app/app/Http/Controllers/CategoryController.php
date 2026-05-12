<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;


class CategoryController extends Controller
{
    public function index() {

        $categories = Category::
        where('user_id', auth()->user()->id)
        ->select('id', 'name', 'color_code')
        ->get();

        return response()->json($categories, 200);
    }
}
