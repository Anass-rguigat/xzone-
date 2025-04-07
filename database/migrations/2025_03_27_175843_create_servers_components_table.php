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
        Schema::create('servers_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ram_id')->nullable()->constrained()->onDelete('cascade');  
            $table->foreignId('server_id')->constrained()->onDelete('cascade');
            $table->foreignId('hard_drive_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('processor_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('power_supply_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('motherboard_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('network_card_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('raid_controller_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('cooling_solution_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('chassis_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('graphic_card_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('fiber_optic_card_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('expansion_card_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('cable_connector_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('battery_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servers_components');
    }
};
