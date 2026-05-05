import { forwardRef } from "react";
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  activeClassName?: string;
  className?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ activeClassName = "", className = "", ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          [className, isActive ? activeClassName : ""].join(" ").trim()
        }
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
