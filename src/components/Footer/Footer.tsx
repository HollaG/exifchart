const Footer = () => {
    return (
        <footer className="p-3 bg-gray-200 text-center md:flex justify-center items-center flex-wrap">
            <p className="text-gray-500 text-sm">
                
                Found an issue? Report on{" "}
                <a
                    href="https://github.com/HollaG/exifchart"
                    target="_blank"
                    className="underline hover:text-gray-800"
                    rel="noopener noreferrer"
                >
                    Github
                </a>
            </p>
            <p className="text-gray-500 text-sm mx-1 hidden md:inline-block">|</p>
            <p className="text-gray-500 text-sm">
                Copyright © 2021 Marcus. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
