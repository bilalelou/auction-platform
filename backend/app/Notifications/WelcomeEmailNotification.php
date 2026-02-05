<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Get email template from database
        $template = EmailTemplate::where('key', 'welcome_email')
            ->where('is_active', true)
            ->first();

        if (!$template) {
            // Fallback default template
            return (new MailMessage)
                ->subject('مرحبا بك!')
                ->line("مرحبا {$notifiable->name}،")
                ->line('شكرا لتسجيلك في منصتنا.')
                ->line('نحن سعداء بانضمامك إلينا!');
        }

        // Replace placeholders in the template
        $body = str_replace(
            ['{name}', '{email}'],
            [$notifiable->name, $notifiable->email],
            $template->body
        );

        // Split body into lines for MailMessage
        $lines = explode("\n", $body);
        
        $message = (new MailMessage)->subject($template->subject);
        
        foreach ($lines as $line) {
            if (trim($line)) {
                $message->line($line);
            }
        }

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
