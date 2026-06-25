import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";

import Layout from "../components/Layout";
import AdminLayout from "../components/admin/AdminLayout";
import Transition from "../components/Transition";
import { useAnalytics } from "../lib/useAnalytics";

import "../styles/globals.css";

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");

  // Trigger client-side page views tracking
  useAnalytics();

  if (isAdmin) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={router.route} className="h-full">
          <Transition />
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function MyApp(props) {
  return (
    <SWRConfig value={{ fetcher: (url) => fetch(url).then((res) => res.json()) }}>
      <AppContent {...props} />
    </SWRConfig>
  );
}

export default MyApp;
