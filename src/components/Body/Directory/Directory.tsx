import DirectoryPicker from "./DirectoryPicker";
import DirectoryViewer from "./DirectoryViewer";

const Directory = () => {
    return (
        <section>
            <div className="rounded overflow-hidden">
                <div className="directory-header flex p-3 bg-gray-100 items-center">
                    <h1 className="flex-grow text-xl"> Directory picker </h1>
                    <div className="">
                        <DirectoryPicker />
                    </div>
                </div>
                <div className="directory-contents p-4 border-gray-100 border-4">
                    <DirectoryViewer />
                </div>
            </div>
        </section>
    );
};

export default Directory;
