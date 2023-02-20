import Book from "./Book";

const BooksLibrary = () => {
    // get all books

    return (
        <div className=" mt-3 ml-3">
            <div className="row d-flex d-wrap">
                <div className="card-deck d-flex flex-wrap justify-content-center">
                    <Book></Book>
                    <Book></Book>
                    <Book></Book>
                    <Book></Book>
                    <Book></Book>
                    <Book></Book>
                    <Book></Book>

                </div>
            </div>
        </div>
    );
}

export default BooksLibrary;