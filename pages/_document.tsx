// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="hiStories" />
          <link rel="manifest" href="manifest.json" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <meta name="theme-color" content="#17A6FA" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
