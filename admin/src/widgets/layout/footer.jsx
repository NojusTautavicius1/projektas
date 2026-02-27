import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-4 mt-8">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2">
        <Typography variant="small" className="font-normal text-gray-400">
          &copy; {year} {brandName}. Visos teisės saugomos.
        </Typography>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Admin Panel",
};

Footer.propTypes = {
  brandName: PropTypes.string,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
