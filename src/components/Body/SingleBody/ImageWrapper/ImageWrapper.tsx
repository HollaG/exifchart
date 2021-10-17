import Container from "../../../../ui/Container";
import ContainerHeader from "../../../../ui/ContainerHeader";
import BodyButton from "../../../../ui/BodyButton";
import ContainerContents from "../../../../ui/ContainerContents";

const ImageWrapper: React.FC<{ onImageSelected: () => void; image: string; error: string }> =
    ({ onImageSelected, image, error }) => {
        const viewInNewTab = () => {
            const newWindow = window.open(
                image,
                "_blank",
                "noopener,noreferrer"
            );
            if (newWindow) newWindow.opener = null;
        };
        return (
            <Container>
                <ContainerHeader>
                    <h1 className="flex-grow text-xl px-3"> Image preview </h1>
                    <BodyButton onClick={onImageSelected}>
                        Select image
                    </BodyButton>
                </ContainerHeader>
                <ContainerContents padding={false}>
                    {!image && !error && <p className="p-4"> Select an image to get started. </p>}
                    {image && !error && <div className="flex justify-center items-center">
                        <img
                            src={image}
                            className="cursor-pointer object-contain"
                            onClick={viewInNewTab}
                            alt="Preview for user selection"
                        />
                    </div>}
                    {error && <p className="p-4">{error}</p>}
                </ContainerContents>
            </Container>
        );
    };

export default ImageWrapper;
