import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit {
  posts: any[] = [];
  selectedTopic = 'All';

  newPost = {
    title: '',
    content: '',
    topic: 'Routes',
    photoUrl: ''
  };

  commentText: any = {};

  topics = ['All', 'Routes', 'Destinations', 'Travel Tips', 'Travel Advice'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPosts();
  }

  get user() {
    const data = sessionStorage.getItem('Loggedinuser');
    return data ? JSON.parse(data) : null;
  }

  loadPosts() {
    this.http.get<any[]>('http://localhost:5000/community').subscribe({
      next: (res) => this.posts = res,
      error: (err) => console.log(err)
    });
  }

  createPost() {
    if (!this.user) {
      alert('Only verified users can create posts. Please sign in with Google.');
      return;
    }

    const postData = {
      ...this.newPost,
      userName: this.user.name || 'Verified User',
      userEmail: this.user.email
    };

    this.http.post('http://localhost:5000/community', postData).subscribe({
      next: () => {
        alert('Post created successfully');
        this.newPost = { title: '', content: '', topic: 'Routes', photoUrl: '' };
        this.loadPosts();
      },
      error: (err) => console.log(err)
    });
  }

  likePost(id: string) {
    this.http.put(`http://localhost:5000/community/${id}/like`, {}).subscribe(() => {
      this.loadPosts();
    });
  }

  addComment(postId: string) {
    if (!this.user) {
      alert('Please sign in to comment.');
      return;
    }

    if (!this.commentText[postId]) return;

    const comment = {
      userName: this.user.name || 'Verified User',
      text: this.commentText[postId]
    };

    this.http.post(`http://localhost:5000/community/${postId}/comment`, comment).subscribe(() => {
      this.commentText[postId] = '';
      this.loadPosts();
    });
  }

  reportPost(id: string) {
    this.http.put(`http://localhost:5000/community/${id}/report`, {}).subscribe(() => {
      alert('Post reported for review.');
      this.loadPosts();
    });
  }

  sharePost(post: any) {
    const text = `${post.title} - Shared from TedBus Community`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  }

  get filteredPosts() {
    if (this.selectedTopic === 'All') return this.posts;
    return this.posts.filter(post => post.topic === this.selectedTopic);
  }

  get popularPosts() {
    return [...this.posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  }
}