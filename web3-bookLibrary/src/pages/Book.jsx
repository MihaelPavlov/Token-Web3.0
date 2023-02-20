const Book = () => {
    return (
        <div className="card m-5">
            <div className="card-body">
                <h4 className="card-title text-center">Book Title</h4>
                <p className="text-center">Copies: 2</p>
            </div>
            <div className="card-footer">
                <a className="btn btn-success mx-4"> Borrow
                    {/* {
                        context.email == movie.email
                            ? <div className="btn btn-info" onClick={() => {
                                navigate(`/details/${movie.id}`); //TODO: Change to real details:id
                            }}>Details
                            </div>
                            : <span>Cannot edit this movie</span>
                    } */}
                </a>
                <a className="btn btn-danger mx-4">Return</a>
            </div>

        </div>
    );
}


export default Book;