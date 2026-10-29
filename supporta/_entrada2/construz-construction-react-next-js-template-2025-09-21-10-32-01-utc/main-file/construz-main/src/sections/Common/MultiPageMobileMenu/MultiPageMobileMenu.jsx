"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const MultiPageMobileMenu = ({ isMenuOpen, setIsMenuOpen }) => {
    const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
    const [isMultiPageMenuOpen, setIsMultiPageMenuOpen] = useState(false);
    const [isOnePageMenuOpen, setIsOnePageMenuOpen] = useState(false);
    const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
    const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
    const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
    const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
    const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);


    const handleMobileMenuClose = () => {
        setIsMenuOpen(false);
    }

    const [menuStyles, setMenuStyles] = useState({
        isHomeMenu: {
            opacity: 0,
            transition: 'opacity 0.5s ease',
            display: 'none',
        },
        isMultiPageMenu: {
            opacity: 0,
            transition: 'opacity 0.5s ease',
            display: 'none',
        },
        isOnePageMenu: {
            opacity: 0,
            transition: 'opacity 0.5s ease',
            display: 'none',
        },
        isPagesMenu: {
            opacity: 0,
            transition: 'opacity 0.5s ease',
            display: 'none',
        },
        isProjectMenu: {
            opacity: 0,
            transition: 'opacity 0.5s ease',
            display: 'none',
        },
    });

    // Home
    useEffect(() => {
        if (isHomeMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isHomeMenu: {
                    ...prevStyles.isHomeMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isHomeMenu: {
                        ...prevStyles.isHomeMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isHomeMenu: {
                    ...prevStyles.isHomeMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isHomeMenu: {
                        ...prevStyles.isHomeMenu,
                        display: 'none',
                    },
                }));
            }, 500);
        }
    }, [isHomeMenuOpen]);
    // MultiPage
    useEffect(() => {
        if (isMultiPageMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isMultiPageMenu: {
                    ...prevStyles.isMultiPageMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isMultiPageMenu: {
                        ...prevStyles.isMultiPageMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isMultiPageMenu: {
                    ...prevStyles.isMultiPageMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isMultiPageMenu: {
                        ...prevStyles.isMultiPageMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isMultiPageMenuOpen]);
    // OnePage
    useEffect(() => {
        if (isOnePageMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isOnePageMenu: {
                    ...prevStyles.isOnePageMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isOnePageMenu: {
                        ...prevStyles.isOnePageMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isOnePageMenu: {
                    ...prevStyles.isOnePageMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isOnePageMenu: {
                        ...prevStyles.isOnePageMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isOnePageMenuOpen]);
    // PagesPage
    useEffect(() => {
        if (isPagesMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isPagesMenu: {
                    ...prevStyles.isPagesMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isPagesMenu: {
                        ...prevStyles.isPagesMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isPagesMenu: {
                    ...prevStyles.isPagesMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isPagesMenu: {
                        ...prevStyles.isPagesMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isPagesMenuOpen]);
    // ProjectPage
    useEffect(() => {
        if (isProjectMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isProjectMenu: {
                    ...prevStyles.isProjectMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isProjectMenu: {
                        ...prevStyles.isProjectMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isProjectMenu: {
                    ...prevStyles.isProjectMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isProjectMenu: {
                        ...prevStyles.isProjectMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isProjectMenuOpen]);
    // Service
    useEffect(() => {
        if (isServiceMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isServiceMenu: {
                    ...prevStyles.isServiceMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isServiceMenu: {
                        ...prevStyles.isServiceMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isServiceMenu: {
                    ...prevStyles.isServiceMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isServiceMenu: {
                        ...prevStyles.isServiceMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isServiceMenuOpen]);
    // ShopPage
    useEffect(() => {
        if (isShopMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isShopMenu: {
                    ...prevStyles.isShopMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isShopMenu: {
                        ...prevStyles.isShopMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isShopMenu: {
                    ...prevStyles.isShopMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isShopMenu: {
                        ...prevStyles.isShopMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isShopMenuOpen]);
    // BlogPage
    useEffect(() => {
        if (isBlogMenuOpen) {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isBlogMenu: {
                    ...prevStyles.isBlogMenu,
                    display: 'block',
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isBlogMenu: {
                        ...prevStyles.isBlogMenu,
                        opacity: 1,
                    },
                }));
            }, 100);
        } else {
            setMenuStyles((prevStyles) => ({
                ...prevStyles,
                isBlogMenu: {
                    ...prevStyles.isBlogMenu,
                    opacity: 0,
                },
            }));
            setTimeout(() => {
                setMenuStyles((prevStyles) => ({
                    ...prevStyles,
                    isBlogMenu: {
                        ...prevStyles.isBlogMenu,
                        display: 'none',
                    },
                }));
            }, 300);
        }
    }, [isBlogMenuOpen]);
    return (
        <div className={`mobile-menu-wrapper ${isMenuOpen ? 'body-visible' : ''}`}>
            <div className="mobile-menu-area">
                <div className="mobile-logo">
                    <Link href="/home-1">
                        <img src="/main-assets/img/logo.svg" alt="Construz" />
                    </Link>
                    <button onClick={handleMobileMenuClose} className="menu-toggle">
                        <i className="ri-close-line"></i>
                    </button>
                </div>
                <div className="mobile-menu">
                    <ul>
                        <li className={`menu-item-has-children submenu-item-has-children ${isHomeMenuOpen ? 'active-class' : ''}`}>
                            <Link onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)} href="#">Home <span className="mean-expand-class"></span></Link>
                            <ul className={`sub-menu submenu-class ${isHomeMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isHomeMenu}>
                                <li className={`menu-item-has-children submenu-item-has-children ${isMultiPageMenuOpen ? 'active-class' : ''}`}>
                                    <Link onClick={() => setIsMultiPageMenuOpen(!isMultiPageMenuOpen)} href="#">Multipage <span className="mean-expand-class"></span></Link>
                                    <ul className={`sub-menu submenu-class ${isMultiPageMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isMultiPageMenu}>
                                        <li><Link href="/pages/homepage/home-1">Home 01</Link></li>
                                        <li><Link href="/pages/homepage/home-2">Home 02</Link></li>
                                        <li><Link href="/pages/homepage/home-3">Home 03</Link></li>
                                        <li><Link href="/pages/homepage/home-4">Home 04</Link></li>
                                        <li><Link href="/pages/homepage/home-5">Home 05</Link></li>
                                    </ul>
                                </li>
                                <li className={`menu-item-has-children submenu-item-has-children ${isOnePageMenuOpen ? 'active-class' : ''}`}>
                                    <Link onClick={() => setIsOnePageMenuOpen(!isOnePageMenuOpen)} href="#">Onepage <span className="mean-expand-class"></span></Link>
                                    <ul className={`sub-menu submenu-class ${isOnePageMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isOnePageMenu}>
                                        <li><Link href="/pages/homepage/home-1-op">Home 01 Onepage</Link></li>
                                        <li><Link href="/pages/homepage/home-2-op">Home 02 Onepage</Link></li>
                                        <li><Link href="/pages/homepage/home-3-op">Home 03 Onepage</Link></li>
                                        <li><Link href="/pages/homepage/home-4-op">Home 04 Onepage</Link></li>
                                        <li><Link href="/pages/homepage/home-5-op">Home 05 Onepage</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><Link href="/pages/innerpage/about">About</Link></li>
                        <li className={`menu-item-has-children submenu-item-has-children ${isPagesMenuOpen ? 'active-class' : ''}`}>
                            <Link onClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)} href="#">Pages <span className="mean-expand-class"></span></Link>
                            <ul className={`sub-menu submenu-class ${isPagesMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isPagesMenu}>
                                <li><Link href="/pages/innerpage/team">Team Page</Link></li>
                                <li><Link href="/pages/innerpage/team-details">Team Details</Link></li>
                                <li><Link href="/pages/innerpage/shop">Shop Page</Link></li>
                                <li><Link href="/pages/innerpage/shop-details">Shop Details</Link></li>
                                <li><Link href="/pages/innerpage/cart">Cart</Link></li>
                                <li><Link href="/pages/innerpage/checkout">Checkout</Link></li>
                                <li><Link href="/pages/innerpage/wishlist">Wishlist</Link></li>
                            </ul>
                        </li>
                        <li className={`menu-item-has-children submenu-item-has-children ${isProjectMenuOpen ? 'active-class' : ''}`}>
                            <Link onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)} href="#">Project <span className="mean-expand-class"></span></Link>
                            <ul className={`sub-menu submenu-class ${isProjectMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isProjectMenu}>
                                <li><Link href="/pages/innerpage/project">Projects</Link></li>
                                <li><Link href="/pages/innerpage/project-details">Project Details</Link></li>
                            </ul>
                        </li>
                        <li className={`menu-item-has-children submenu-item-has-children ${isServiceMenuOpen ? 'active-class' : ''}`}>
                            <Link onClick={() => setIsServiceMenuOpen(!isServiceMenuOpen)} href="#">Service <span className="mean-expand-class"></span></Link>
                            <ul className={`sub-menu submenu-class ${isServiceMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isServiceMenu}>
                                <li><Link href="/pages/innerpage/service">Service</Link></li>
                                <li><Link href="/pages/innerpage/service-details">Service Details</Link></li>
                            </ul>
                        </li>
                        <li className={`menu-item-has-children submenu-item-has-children ${isShopMenuOpen ? 'active-class' : ''}`}>
                            <Link onClick={() => setIsShopMenuOpen(!isShopMenuOpen)} href="#">Shop <span className="mean-expand-class"></span></Link>
                            <ul className={`sub-menu submenu-class ${isShopMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isShopMenu}>
                                <li><Link href="/pages/innerpage/shop">Shop</Link></li>
                                <li><Link href="/pages/innerpage/shop-details">Shop Details</Link></li>
                                <li><Link href="/pages/innerpage/cart">Cart</Link></li>
                                <li><Link href="/pages/innerpage/checkout">Checkout</Link></li>
                                <li><Link href="/pages/innerpage/wishlist">Wishlist</Link></li>
                            </ul>
                        </li>
                        <li className={`menu-item-has-children submenu-item-has-children ${isBlogMenuOpen ? 'active-class' : ''}`}>
                            <Link onClick={() => setIsBlogMenuOpen(!isBlogMenuOpen)} href="#">Blog <span className="mean-expand-class"></span></Link>
                            <ul className={`sub-menu submenu-class ${isBlogMenuOpen ? 'menu-open' : ''}`} style={menuStyles.isBlogMenu}>
                                <li><Link href="/pages/innerpage/blog">Blog</Link></li>
                                <li><Link href="/pages/innerpage/blog-details">Blog Details</Link></li>
                            </ul>
                        </li>
                        <li><Link href="/pages/innerpage/contact">Contact</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MultiPageMobileMenu;