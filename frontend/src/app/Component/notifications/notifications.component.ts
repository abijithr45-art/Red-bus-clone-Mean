import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  preferences = {
    email: true,
    push: true,
    promotional: false,
    language: 'en'
  };

  newNotification = {
    title: '',
    message: '',
    type: 'booking'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const savedPrefs = localStorage.getItem('notificationPrefs');
    if (savedPrefs) {
      this.preferences = JSON.parse(savedPrefs);
    }

    this.loadNotifications();
  }

  get user() {
    const data = sessionStorage.getItem('Loggedinuser');
    return data ? JSON.parse(data) : null;
  }

  get userEmail() {
    return this.user?.email || 'demo@tedbus.com';
  }

  savePreferences() {
    localStorage.setItem('notificationPrefs', JSON.stringify(this.preferences));
    alert('Notification preferences saved');
  }

  loadNotifications() {
    this.http.get<any[]>(`http://localhost:5000/notifications/${this.userEmail}`)
      .subscribe({
        next: (res) => this.notifications = res,
        error: (err) => console.log(err)
      });
  }

  sendNotification() {
    const payload = {
      userEmail: this.userEmail,
      title: this.newNotification.title,
      message: this.localizedMessage(this.newNotification.message),
      type: this.newNotification.type,
      channels: {
        email: this.preferences.email,
        push: this.preferences.push
      },
      language: this.preferences.language
    };

    if (payload.type === 'offer' && !this.preferences.promotional) {
      alert('Promotional notifications are disabled');
      return;
    }

    this.http.post('http://localhost:5000/notifications', payload).subscribe({
      next: () => {
        alert('Notification sent and logged');
        this.newNotification = { title: '', message: '', type: 'booking' };
        this.loadNotifications();
      },
      error: (err) => console.log(err)
    });
  }

  markRead(id: string) {
    this.http.put(`http://localhost:5000/notifications/${id}/read`, {})
      .subscribe(() => this.loadNotifications());
  }

  retry(id: string) {
    this.http.put(`http://localhost:5000/notifications/${id}/retry`, {})
      .subscribe(() => this.loadNotifications());
  }

  localizedMessage(message: string) {
    if (this.preferences.language === 'ml') {
      return message + ' | Malayalam notification enabled';
    }
    if (this.preferences.language === 'hi') {
      return message + ' | Hindi notification enabled';
    }
    return message;
  }
}