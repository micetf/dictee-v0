// src/components/Navbar.jsx
export default function Navbar() {
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
                <div className="max-w-full px-4">
                    <div className="flex items-center justify-between h-14">
                        {/* Lien MiCetF */}
                        <a
                            href="https://micetf.fr"
                            className="text-white font-semibold text-lg hover:text-gray-300 transition"
                        >
                            MiCetF
                        </a>

                        {/* Burger (même comportement que l’original, non utilisé ici) */}
                        <button
                            className="md:hidden inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
                            type="button"
                            aria-controls="navbarToggle"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </button>

                        {/* Partie droite (desktop) */}
                        <div className="hidden md:flex md:items-center md:flex-1">
                            {/* Breadcrumb / titre outil */}
                            <div className="flex items-center ml-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-4 w-4 mr-1"
                                    fill="#f8f9fa"
                                >
                                    <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"></path>
                                </svg>
                                <span className="text-white font-semibold text-lg">
                                    Je crée mes dictées - Markdown
                                </span>
                            </div>

                            <div className="flex-1" />

                            {/* Boutons PayPal + contact */}
                            <ul className="flex items-center space-x-2">
                                <li>
                                    <form
                                        action="https://www.paypal.com/cgi-bin/webscr"
                                        method="post"
                                        target="_top"
                                        className="inline-block"
                                    >
                                        <button
                                            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition my-1 mx-1"
                                            title="Si vous pensez que ces outils le méritent... Merci !"
                                            type="submit"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                className="h-4 w-4 inline"
                                                fill="#f8f9fa"
                                            >
                                                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z"></path>
                                            </svg>
                                        </button>
                                        <input
                                            type="hidden"
                                            name="cmd"
                                            value="_s-xclick"
                                        />
                                        <input
                                            type="hidden"
                                            name="hosted_button_id"
                                            value="Q2XYVFP4EEX2J"
                                        />
                                    </form>
                                </li>
                                <li>
                                    <a
                                        href="mailto:micetf@laposte.net"
                                        className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition my-1 mx-1"
                                        title="Pour contacter le webmaster..."
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            className="h-4 w-4 inline"
                                            fill="#f8f9fa"
                                        >
                                            <path d="M18 2a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"></path>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="h-16"></div>
        </>
    );
}
