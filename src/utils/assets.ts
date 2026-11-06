/**
 * Universal image asset URL resolver for Local Dev, Vite Preview, and GitHub Pages deployments.
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Remove leading slash
  let clean = path.replace(/^\/+/, '');

  // Map legacy / internal paths to public /images/
  clean = clean.replace(/^src\/assets\/images\//, 'images/');
  clean = clean.replace(/^public\//, '');

  const base = import.meta.env.BASE_URL || './';
  if (base.endsWith('/')) {
    return `${base}${clean}`;
  }
  return `${base}/${clean}`;
};
