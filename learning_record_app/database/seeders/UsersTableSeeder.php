<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dummyUsers = [
            [
                'name' => '松岡泰生',
                'email' => 'taiki1544.0711@gmail.com',
                'password' => 'Taiki1544',
                'birthday' => '1999-07-11',
            ],
            [
                'name' => 'ダミー花子',
                'email' => 'test@test.com',
                'password' => 'password',
                'birthday' => '1998-07-22',
            ],
        ];

        foreach ($dummyUsers as $data) {
            $user = new User;
            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->password = $data['password'];
            $user->birthday = $data['birthday'];
            $user->save();
        }
    }
}
