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
        Schema::create('raid_controllers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('model');
            $table->decimal('price', 10, 2);
            $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade');
            $table->string('supported_levels');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raid_controllers');
    }
};
