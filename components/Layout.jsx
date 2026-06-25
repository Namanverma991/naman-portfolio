import { Sora } from "next/font/google";
import Head from "next/head";
import useSWR from "swr";

import Header from "../components/Header";
import Nav from "../components/Nav";
import TopLeftImg from "../components/TopLeftImg";
import { resumeData } from "../data/resumeData";

// setup font
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const Layout = ({ children }) => {
  const { data: settings } = useSWR('/api/settings');
  const { data: personal } = useSWR('/api/content/personal');

  const name = personal?.name || resumeData.personal.name;
  const siteTitle = settings?.siteTitle || `${name} | Portfolio`;
  const metaDescription = settings?.metaDescription || personal?.summary || resumeData.personal.summary;
  const metaKeywords = settings?.metaKeywords || "react, next, nextjs, html, css, javascript, js, data-science, machine-learning, python, portfolio, framer-motion, particle-effect";
  const themeColor = settings?.accentColor || "#f13024";

  return (
    <main
      className={`page bg-site text-white bg-cover bg-no-repeat ${sora.variable} font-sora relative`}
    >
      {/* metadata */}
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="author" content={name} />
        <meta name="theme-color" content={themeColor} />
      </Head>

      <TopLeftImg />
      <Nav />
      <Header />

      {/* main content */}
      {children}
    </main>
  );
};

export default Layout;
