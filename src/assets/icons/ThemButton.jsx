import { Button } from "antd";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { PiSunDimFill } from "react-icons/pi";

export const ThemeButton = () => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = (th) => {
    if (th === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("preferredTheme", "dark");
      setTheme("dark");
    }
    if (th === "light") {
      document.documentElement.setAttribute("data-theme", "");
      localStorage.setItem("preferredTheme", "light");
      setTheme("light");
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("preferredTheme");

    if (theme) {
      setTheme(theme);
      toggleTheme(theme);
    } else {
      setTheme("dark");
    }
  }, []);

  if (theme === "dark") {
    return (
      <Button
        className="p-1 text-textColor"
        type="text"
        onClick={() => toggleTheme("light")}
      >
        <FaMoon size={"2em"} />
      </Button>
    );
  } else if (theme === "light") {
    return (
      <Button
        className="p-1 text-textColor"
        type="text"
        onClick={() => toggleTheme("dark")}
      >
        <PiSunDimFill size={"2em"} />
      </Button>
    );
  } else {
    return <></>;
  }
};
