<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EmailTemplate::updateOrCreate(
            ['key' => 'welcome_email'],
            [
                'subject' => 'مرحبا بك في منصتنا!',
                'body' => "مرحبا {name}،\n\nشكرا لتسجيلك في منصتنا. نحن سعداء بانضمامك إلينا!\n\nيمكنك الآن البدء في استخدام جميع الخدمات المتاحة.\n\nمع أطيب التحيات،\nفريق العمل",
                'is_active' => true,
            ]
        );
    }
}
