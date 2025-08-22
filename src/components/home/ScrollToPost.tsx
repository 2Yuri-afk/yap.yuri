'use client';

import { useEffect } from 'react';

export default function ScrollToPost() {
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const elementId = window.location.hash.substring(1); // Remove the #
      const element = document.getElementById(elementId);

      if (element) {
        // Wait a bit for the page to fully render
        setTimeout(() => {
          // Scroll to the element with some offset for better visibility
          const yOffset = -100; // Adjust this value to control offset from top
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: y,
            behavior: 'smooth',
          });

          // Add a highlight effect to the post
          element.classList.add('highlight-post');

          // Remove highlight after animation
          setTimeout(() => {
            element.classList.remove('highlight-post');
          }, 2000);
        }, 100);
      }
    }
  }, []);

  return null;
}
