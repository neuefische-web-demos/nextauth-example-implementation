import GlobalStyle from "../styles.js";
import { SWRConfig } from "swr";
import Layout from "../components/Layout.js";
import { SessionProvider, useSession } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig
        value={{
          fetcher: async (...args) => {
            const response = await fetch(...args);
            if (!response.ok) {
              throw new Error(`Request with ${JSON.stringify(args)} failed.`);
            }
            return await response.json();
          },
        }}
      >
        <Layout>
          <GlobalStyle />
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </Layout>
      </SWRConfig>
    </SessionProvider>
  );
}

function Auth({ children }) {
  // required: true makes only 'loading' or 'authenticated' possible. Else the user is redirected to login page.
  const { status } = useSession({ required: true });
  if (status === "loading") {
    return <div>Is loading...</div>;
  }
  return children;
}
