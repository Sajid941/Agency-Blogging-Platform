"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "../themeToggleButton/ThemeToggleButton";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Navigation links
    const links = [
        { id: 1, title: "Home", path: "/" },
        { id: 2, title: "About", path: "/about" },
        { id: 3, title: "Portfolio", path: "/portfolio" },
        { id: 4, title: "Blogs", path: "/blogs" },
        { id: 5, title: "Contact", path: "/contact" },
        { id: 6, title: "Dashboard", path: "/dashboard" },
    ];

    const pathname = usePathname();

    return (
        <header className="my-5 flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex  gap-3">
                <button
                    className="md:hidden text-xl text-gray-text"
                    aria-label="Toggle menu"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <GiHamburgerMenu />
                </button>
                <Link
                    href="/"
                    className="text-xl font-semibold text-primary-500"
                >
                    Creative <span className="text-gray-text">Ink</span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="md:flex items-center gap-3 hidden">
                <ThemeToggleButton />
                {/* Navigation Links */}
                <ul className="md:flex gap-2">
                    {links.map((link) => (
                        <li key={link.id}>
                            <Link
                                href={link.path}
                                className={`hover:text-black dark:hover:text-white px-1 ${
                                    pathname === link.path
                                        ? "text-primary-600 border-b border-primary-600 font-medium"
                                        : "text-gray-text"
                                }`}
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Sign-in Button */}
                <div className="ml-3">
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button className="bg-primary-500 hover:bg-primary-400 font-medium text-black">
                                Signin
                            </Button>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden z-50">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                {/* Hamburger Menu Button */}

                {/* Mobile Menu */}
                <aside
                    className={`w-72 h-screen bg-[#0C0C0C] fixed top-0 transition duration-500 ${
                        isMenuOpen ? "right-0" : "hidden"
                    }`}
                >
                    <div className="py-5 px-3">
                        {/* Close Button */}
                        <div
                            onClick={() => setIsMenuOpen(false)}
                            className="flex w-full justify-end text-white cursor-pointer"
                            aria-label="Close menu"
                        >
                            <IoCloseSharp size={20} />
                        </div>

                        {/* Sign-in Button in Mobile Menu */}
                        <div className="flex justify-between items-center my-5 ml-2">
                            <ThemeToggleButton />
                            <SignedOut>
                                <Link onClick={()=>setIsMenuOpen(false)} href="/sign-in">
                                    <Button className="bg-primary-500 hover:bg-primary-400 font-medium text-black">
                                        Sign in
                                    </Button>
                                </Link>
                            </SignedOut>
                        </div>

                        {/* Navigation Links in Mobile Menu */}
                        <ul className="flex flex-col gap-3 ml-3">
                            {links.map((link) => (
                                <li key={link.id}>
                                    <Link
                                        onClick={() => setIsMenuOpen(false)}
                                        href={link.path}
                                        className={`text-xl ${
                                            pathname === link.path
                                                ? "text-primary-600 border-b border-primary-600 font-medium"
                                                : "text-white "
                                        }`}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </header>
    );
};

export default Navbar;
