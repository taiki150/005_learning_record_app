<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Matsuoka Taiki',
            'email' => 'taiki1544.0711@gmail.com',
            'birthday' => '1999-07-11',
            'password' => Hash::make('Taiki1544'),
        ]);

        $this->call(CategorySeeder::class);
    }
}
