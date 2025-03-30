<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove the old subscriptionTier column if it exists
            if (Schema::hasColumn('users', 'subscriptionTier')) {
                $table->dropColumn('subscriptionTier');
            }
            // Remove the custom subscription_id column because Billable uses its own subscriptions table
            if (Schema::hasColumn('users', 'subscription_id')) {
                $table->dropForeign(['subscription_id']);
                $table->dropColumn('subscription_id');
            }

            // Add a column to track AI calls usage (position as needed)
            $table->integer('ai_calls_count')->default(0)->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Optionally, re-add the old subscriptionTier column
            $table->string('subscriptionTier')->nullable()->after('id');

            // Drop the AI calls counter
            $table->dropColumn('ai_calls_count');

            // Optionally, re-add the subscription_id column (if you need to revert to your custom solution)
            $table->unsignedBigInteger('subscription_id')->nullable()->after('id');
            $table->foreign('subscription_id')->references('id')->on('subscriptions');
        });
    }
};
