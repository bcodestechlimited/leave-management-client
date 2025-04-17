import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  // Generate breadcrumb items
  return (
    <nav className="flex items-center text-gray-600 text-sm space-x-2 mb-4">
      {/* Display the Dashboard link */}
      {pathnames.length > 1 && (
        <>
          <Link
            to={`/${pathnames[0]}/${pathnames[1]}`}
            className={`hover:text-black ${
              pathnames.length > 2 ? "" : " font-semibold text-gray-900"
            }`}
          >
            Dashboard
          </Link>
          {pathnames.length > 2 && <span>/</span>}
        </>
      )}

      {/* Display the remaining pathnames */}
      {pathnames.slice(2).map((segment, index) => {
        const fullPath = `/${pathnames.slice(0, index + 3).join("/")}`;
        const isLast = index === pathnames.slice(2).length - 1;
        const formattedSegment = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <div key={fullPath} className="flex items-center space-x-2">
            {isLast ? (
              <span className="font-semibold text-gray-900">
                {formattedSegment}
              </span>
            ) : (
              <>
                <Link to={fullPath} className="hover:text-black">
                  {formattedSegment}
                </Link>
                <span>/</span>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
