import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HiHome, HiOutlineHome, HiOutlineShoppingBag, HiShoppingBag, HiOutlineHeart, HiHeart, HiOutlineUser, HiUser } from "react-icons/hi";
import { selectCartItemCount } from "../../redux/slices/cartSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";

export default function MobileNav() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const wishlistCount = useSelector((s) => s.wishlist.ids.length);
  const cartCount = useSelector(selectCartItemCount);
  const p = location.pathname;

  const tabs = [
    { path: "/", label: "Home", Icon: HiOutlineHome, ActiveIcon: HiHome },
    { path: "/products", label: "Shop", Icon: HiOutlineShoppingBag, ActiveIcon: HiShoppingBag },
    { path: "/wishlist", label: "Wishlist", Icon: HiOutlineHeart, ActiveIcon: HiHeart, badge: wishlistCount, auth: true },
    { path: "/profile", label: "Account", Icon: HiOutlineUser, ActiveIcon: HiUser, auth: true },
  ];

  return (
    <nav className="mobile-nav md:hidden bg-white/80 dark:bg-dark-800/80 border-t border-gray-100 dark:border-dark-600 pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ path, label, Icon, ActiveIcon, badge, auth }) => {
          const active = p === path || (path !== "/" && p.startsWith(path));
          const handleClick = auth && !user ? () => dispatch(openAuthModal("login")) : undefined;
          const Comp = auth && !user ? "button" : Link;
          const props = auth && !user ? { onClick: handleClick } : { to: path };

          return (
            <Comp key={path} {...props} className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
              <div className="relative">
                {active ? (
                  <ActiveIcon className="w-6 h-6 text-primary-600" />
                ) : (
                  <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                )}
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-primary-600" : "text-gray-500 dark:text-gray-400"}`}>
                {label}
              </span>
              {active && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />}
            </Comp>
          );
        })}
      </div>
    </nav>
  );
}
