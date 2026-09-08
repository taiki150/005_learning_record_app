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
        Schema::create('github_repositories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->string('owner');
            $table->string('repo_name');
            $table->text('access_token');
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // 重複防止
            $table->unique(['user_id', 'owner', 'repo_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('github_repositories');

    }
};
