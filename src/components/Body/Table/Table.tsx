import Container from "../../../ui/Container";
import ContainerContents from "../../../ui/ContainerContents";
import ContainerHeader from "../../../ui/ContainerHeader";
import DirectoryButton from "../../../ui/DirectoryButton";
import TableViewer from "./TableViewer";

const Table = () => {
    return (
        <Container>
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3">Table view</h1>
                <DirectoryButton onClick={() => {}} extraClasses="mx-2">
                    Export to Excel
                </DirectoryButton>
            </ContainerHeader>
            <ContainerContents>
                {/* <TableViewer/> */}
            </ContainerContents>
        </Container>
    );
};

export default Table;
