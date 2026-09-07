<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LearningRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'study_date' => ['required', 'date'],
            'hours' => ['required', 'integer', 'min:0', 'max:24'],
            'minute' => ['required', 'integer', 'min:0', 'max:59'],
            'ratio' => ['required', 'array'],
            'category_id' => ['required', 'array'],
            'category_id.*' => ['required', 'string', 'exists:categories,id'],
            'memo' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'カテゴリーの選択は必須項目です。',
            'category_id.string'   => 'カテゴリーの指定が正しくありません。',
            'category_id.exists'   => '選択されたカテゴリーは存在しません。',
            'hours.min' => '0時間以下の入力はできません',
            'hours.max' => '24時間以内で入力して下さい',
            'minute.min' => '0分以下の入力はできません',
            'minute.max' => '60分以内で入力して下さい',
        ];
    }
}
