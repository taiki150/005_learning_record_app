<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learning_record_details', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('learning_record_id')
            ->constrained()
            ->onDelete('cascade');

            $table->foreignUuid('category_id')
            ->constrained()
            ->onDelete('cascade');

            $table->decimal('ratio', 3, 2);
            $table->decimal('deuration');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_record_details');
    }
};
