<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ContactMessage;

class AdminNewContactMessage extends Notification
{
    use Queueable;

    protected $contactMessage;

    public function __construct(ContactMessage $contactMessage)
    {
        $this->contactMessage = $contactMessage;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Contact Message Received')
            ->greeting('Hello Admin,')
            ->line('You have received a new contact message from ' . $this->contactMessage->name . ' (' . $this->contactMessage->email . ').')
            ->action('View Message', url('/admin/contacts/' . $this->contactMessage->id))
            ->line('Subject: ' . $this->contactMessage->subject)
            ->line('Message: ' . $this->contactMessage->message);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'contact_message_id' => $this->contactMessage->id,
            'name' => $this->contactMessage->name,
            'email' => $this->contactMessage->email,
            'subject' => $this->contactMessage->subject,
            'message' => $this->contactMessage->message,
        ];
    }
}