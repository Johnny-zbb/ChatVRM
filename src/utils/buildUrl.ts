import getConfig from "next/config";

/**
 * Add repository name to URL when publishing to GitHub Pages
 * Check environment variables to add repository name to URL
 */
export function buildUrl(path: string): string {
  const {
    publicRuntimeConfig,
  }: {
    publicRuntimeConfig: { root: string };
  } = getConfig();

  return publicRuntimeConfig.root + path;
}
