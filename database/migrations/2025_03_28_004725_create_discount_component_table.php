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
        Schema::create('discount_component', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discount_id')->constrained('discounts')->onDelete('cascade');
            $table->foreignId('ram_id')->nullable()->constrained('rams')->onDelete('cascade');
            $table->foreignId('hard_drive_id')->nullable()->constrained('hard_drives')->onDelete('cascade');
            $table->foreignId('processor_id')->nullable()->constrained('processors')->onDelete('cascade');
            $table->foreignId('power_supply_id')->nullable()->constrained('power_supplies')->onDelete('cascade');
            $table->foreignId('motherboard_id')->nullable()->constrained('motherboards')->onDelete('cascade');
            $table->foreignId('network_card_id')->nullable()->constrained('network_cards')->onDelete('cascade');
            $table->foreignId('raid_controller_id')->nullable()->constrained('raid_controllers')->onDelete('cascade');
            $table->foreignId('cooling_solution_id')->nullable()->constrained('cooling_solutions')->onDelete('cascade');
            $table->foreignId('chassis_id')->nullable()->constrained('chassis')->onDelete('cascade');
            $table->foreignId('graphic_card_id')->nullable()->constrained('graphic_cards')->onDelete('cascade');
            $table->foreignId('fiber_optic_card_id')->nullable()->constrained('fiber_optic_cards')->onDelete('cascade');
            $table->foreignId('expansion_card_id')->nullable()->constrained('expansion_cards')->onDelete('cascade');
            $table->foreignId('cable_connector_id')->nullable()->constrained('cable_connectors')->onDelete('cascade');
            $table->foreignId('battery_id')->nullable()->constrained('batteries')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_component');
    }
};
