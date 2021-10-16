import ChartWrapper from "./ChartWrapper/ChartWrapper";
import Directory from "./Directory/Directory";
import Table from "./Table/Table";

const Body = () => {
    return (
        <>
            <div className="xl:flex">
                <section className="m-2 directory-section relative xl:flex-shrink-0 xl:flex-grow-0">
                    <Directory />
                </section>

                <section className="xl:flex-grow m-2 chart-section xl:min-w-0">
                    <ChartWrapper />
                </section>
            </div>
            <section className="m-2 mt-5">
                <Table />
            </section>
        </>
    );
};

export default Body;
