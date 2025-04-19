
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-esport-500 mb-6">404</h1>
        <p className="text-xl text-gray-300 mb-8">Oops! La page que vous recherchez n'existe pas.</p>
        <Link to="/">
          <Button className="bg-esport-600 hover:bg-esport-700">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
