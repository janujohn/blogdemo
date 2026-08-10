function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';
}

function uniqueSlug(db, title, excludeId) {
  const base = slugify(title);
  let slug = base;
  let n = 2;
  while (true) {
    const row = db
      .prepare('SELECT id FROM posts WHERE slug = ?')
      .get(slug);
    if (!row || row.id === excludeId) break;
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

module.exports = { slugify, uniqueSlug };
