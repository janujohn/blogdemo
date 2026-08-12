async function loadPosts() {
  const container = document.getElementById('posts');
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const posts = await res.json();

    if (posts.length === 0) {
      container.innerHTML = '<p class="empty">No posts yet.</p>';
      return;
    }

    container.innerHTML = posts.map(post => `
      <article class="post-card">
        <h2><a href="/post/${post.id}">${post.title}</a></h2>
        <time>${new Date(post.created_at).toLocaleDateString()}</time>
        <p>${post.content.slice(0, 160)}${post.content.length > 160 ? '&hellip;' : ''}</p>
      </article>
    `).join('');
  } catch (err) {
    console.error('Failed to load posts:', err);
    container.innerHTML = '<p class="error">Could not load posts.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);
