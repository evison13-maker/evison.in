const themeButton = document.querySelector('#theme');
function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? 'hsl(210 11.1% 3.53%)' : '#fafaf9';
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch {}
  updateThemeLabel();
});
updateThemeLabel();
const skillDescriptions = {
  JavaScript: 'Interactive websites and browser logic',
  TypeScript: 'Type-safe JavaScript applications',
  Python: 'Scripting, automation, and backend development',
  'Next.js': 'Full-stack React applications',
  React: 'Component-based user interfaces',
  PostgreSQL: 'Relational data and SQL queries',
  SQLite: 'Lightweight embedded SQL databases',
  MongoDB: 'Flexible document databases',
  Docker: 'Containerized applications and development environments',
  Redis: 'In-memory caching and fast data access'
};
for (const skill of window.PROFILE.skills) {
  const badge = document.createElement('span'); badge.className = 'skill';
  badge.textContent = skill;
  badge.tabIndex = 0;
  const tooltip = document.createElement('span');
  tooltip.className = 'skill-tooltip'; tooltip.id = `skill-tip-${skill.replace(/[^a-z]/gi, '').toLowerCase()}`;
  tooltip.setAttribute('role', 'tooltip'); tooltip.textContent = skillDescriptions[skill] || skill;
  badge.setAttribute('aria-describedby', tooltip.id);
  badge.append(tooltip);
  document.querySelector('#skill-list').append(badge);
}
function validUrl(value) { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } }
for (const project of window.PROFILE.projects) {
  const card = document.createElement('article'); card.className = 'project-card';
  const title = document.createElement('h3'); title.textContent = project.title;
  const description = document.createElement('p'); description.textContent = project.description;
  card.append(title, description);
  const tags = document.createElement('div'); tags.className = 'skills';
  for (const technology of project.technologies || []) { const tag = document.createElement('span'); tag.className='skill'; tag.textContent=technology; tags.append(tag); }
  card.append(tags);
  for (const [label, value] of [['Visit project',project.url],['Source code',project.github]]) {
    const url = validUrl(value); if (!url) continue;
    const link = document.createElement('a'); link.className='text-link'; link.href=url; link.target='_blank'; link.rel='noopener noreferrer'; link.textContent=label; link.style.marginRight='20px'; card.append(link);
  }
  document.querySelector('#project-list').append(card);
}
document.querySelector('#project-empty').hidden = window.PROFILE.projects.length > 0;

// Magnify the hovered dock item and its neighbours; restore on pointer exit.
const dock = document.querySelector('.dock');
const dockItems = [...dock.querySelectorAll('a, button')];
function magnifyDock(active) {
  dockItems.forEach((item, index) => {
    const distance = Math.abs(index - active);
    item.style.setProperty('--dock-size', active < 0 ? '36px' : distance === 0 ? '48px' : distance === 1 ? '41px' : '36px');
    item.style.setProperty('--icon-size', active >= 0 && distance === 0 ? '21px' : '18px');
  });
}
dockItems.forEach((item, index) => {
  item.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') magnifyDock(index); });
  item.addEventListener('focus', () => magnifyDock(index));
});
dock.addEventListener('pointerleave', () => magnifyDock(-1));
dock.addEventListener('focusout', event => { if (!dock.contains(event.relatedTarget)) magnifyDock(-1); });
