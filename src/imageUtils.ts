import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanityClient.ts';

/**
 * Image URL builder for Sanity images
 * Provides utility functions to generate optimized image URLs
 */

const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL with common options
 * @param {Object} source - Image reference from Sanity
 * @param {Object} options - URL builder options
 * @returns {string} Optimized image URL
 */
export function getImageUrl(source, options = {}) {
  if (!source) return null;
  
  const defaultOptions = {
    width: 800,
    fit: 'max',
    auto: 'format',
    ...options
  };

  let url = builder.image(source);
  
  if (defaultOptions.width) {
    url = url.width(defaultOptions.width);
  }
  if (defaultOptions.height) {
    url = url.height(defaultOptions.height);
  }
  if (defaultOptions.fit) {
    url = url.fit(defaultOptions.fit);
  }
  if (defaultOptions.auto) {
    url = url.auto(defaultOptions.auto);
  }
  
  return url.url();
}

