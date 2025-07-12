import styles from './404.module.css'; // Import the CSS module
import React from 'react';
export default function NotFound404() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Page Not Found</title>
        {/* Linking to the CSS module is not necessary since it's already imported */}
      </head>
      <body className={styles['term-body']}> {/* Apply class name for body */}
        <div id="message" className={styles['term-message']}> {/* Apply class name for message */}
          <h2 className={styles['term-h2']}>404</h2> {/* Apply class name for h2 */}
          <h1 className={styles['term-h1']}>Page Not Found</h1> {/* Apply class name for h1 */}
          <h3 className={styles['term-h3']}>I have not worked on it probably😅</h3> {/* Apply class name for h3 */}
          <p className={styles['term-p']}>The specified file was not found on this website. Please check the URL for mistakes and try again.</p> {/* Apply class name for p */}
          <a href="/" className={styles['term-a']}>Go to Homepage</a> {/* Apply class name for a */}
        </div>
      </body>
    </html>
  );
}
