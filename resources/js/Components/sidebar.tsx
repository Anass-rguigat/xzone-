import { useState } from "react";
import { Link } from "react-router-dom"; // or @inertiajs/react

interface SidebarItem {
  icon: string;
  text: string;
  subItems?: string[];
}

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const menuItems: SidebarItem[] = [
    { icon: "bi-house-door-fill", text: "Home" },
    { icon: "bi-bookmark-fill", text: "Bookmark" },
    { 
      icon: "bi-chat-left-text-fill", 
      text: "Chatbox",
      subItems: ["Social", "Personal", "Friends"]
    },
    { icon: "bi-box-arrow-in-right", text: "Logout" }
  ];

  return (
    <div className="relative min-h-screen bg-blue-600">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute text-white text-4xl top-5 left-4 cursor-pointer lg:hidden"
      >
        <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 p-2 w-[300px] overflow-y-auto text-center  transition-all duration-300 ${
          isSidebarOpen ? "left-0" : "-left-full"
        } lg:left-0`}
      >
        {/* Logo Section */}
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8 rounded-md bg-blue-600 object-contain"
              />
              <h1 className="font-bold text-gray-200 text-[15px] ml-3">
                Your Brand
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white cursor-pointer ml-28 lg:hidden"
            >
              <i className="bi bi-x text-xl" />
            </button>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]" />
        </div>

        {/* Search Bar */}
        <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white">
          <i className="bi bi-search text-sm" />
          <input
            type="text"
            placeholder="Search"
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              <div className="mt-3">
                <button
                  onClick={() => {
                    toggleDropdown();
                    setActiveMenu(activeMenu === item.text ? "" : item.text);
                  }}
                  className="p-2.5 w-full flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                  <i className={`bi ${item.icon}`} />
                  <div className="flex justify-between w-full items-center">
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">
                      {item.text}
                    </span>
                    <i
                      className={`bi bi-chevron-down transition-transform ${
                        activeMenu === item.text ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {activeMenu === item.text && (
                  <div className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to="#"
                        className="block p-2 hover:bg-blue-600 rounded-md mt-1"
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="#"
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
              >
                <i className={`bi ${item.icon}`} />
                <span className="text-[15px] ml-4 text-gray-200 font-bold">
                  {item.text}
                </span>
              </Link>
            )}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[300px] p-4">
        {/* Your main content here */}
      </div>
    </div>
  );
};