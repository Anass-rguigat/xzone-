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
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->string('model'); 
            $table->string('cpu_socket'); 
            $table->integer('ram_slots'); 
            $table->integer('storage_slots'); 
            $table->string('power_supply_type'); 
            $table->boolean('rack_mountable'); 
            $table->string('form_factor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servers');
    }
};
