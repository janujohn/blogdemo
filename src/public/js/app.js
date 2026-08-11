function renderPosts(posts) {
  const container = document.getElementById("posts");
  if (posts.length === 0) {
    container.innerHTML = "<p>No posts yet.</p>";
    return;
  }
  container.innerHTML = posts
    .map(
      (post) => `
        <div class="post-card">
          <h2><a href="/posts/${post.id}">${post.title}</a></h2>
          <p class="post-meta">${post.created_at}</p>
        </div>
      `
    )
    .join("");
}

fetch("/api/posts")
  .then((res) => res.json())
  .then(renderPosts)
  .catch((err) => console.error("Failed to load posts", err));
