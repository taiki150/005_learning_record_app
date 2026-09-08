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
        Schema::create('github_commits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('github_repository_id')
                ->references('id')
                ->on('github_repositories')
                ->onDelete('cascade');
            $table->string('sha');
            $table->text('message');
            $table->json('technologies');
            $table->timestamp('committed_at');
            $table->unique(['github_repository_id', 'sha']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('github_commits');
    }
};
