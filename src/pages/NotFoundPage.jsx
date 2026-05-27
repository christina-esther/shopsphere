import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrapper } from "../components/ui/index";

export default function NotFoundPage() {
  return (
    <PageWrapper className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
          className="text-[10rem] font-black leading-none gradient-text">404</motion.p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary text-lg px-8 py-4">← Go Home</Link>
      </div>
    </PageWrapper>
  );
}
