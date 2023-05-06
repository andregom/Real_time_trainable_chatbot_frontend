import { useEffect, useState } from 'react';
import './styles.css';
interface PaginationProps {
    numberOfPages: number,
    currentPage: number,
    setCurrentPage: Function
}

const Pagination: React.FC<PaginationProps> = (props) => {

    const initialPageNumbers = Array.from(Array(props.numberOfPages).keys()).map(k => k + 1);
    const currentPage = props.currentPage;
    const numberOfPages = props.numberOfPages;

    const [pagesIndexList, setPagesIndexList] = useState<number[]>(initialPageNumbers);

    useEffect(() => {
        const pageNumbers = Array.from(Array(props.numberOfPages).keys()).map(k => k + 1);
        setPagesIndexList([...pageNumbers]);
    }, [props.numberOfPages]);

    const prevPage = () => {
        if (currentPage !== 1)
            props.setCurrentPage(currentPage - 1)
    }

    const nextPage = () => {
        if (currentPage !== numberOfPages)
            props.setCurrentPage(currentPage + 1)
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <a
                        className="page-link"
                        onClick={prevPage}
                    >
                        {'<<'}
                    </a>
                </li>
                {pagesIndexList.map(pageNumber => (
                    <li key={pageNumber}
                        className={`page-item ${currentPage == pageNumber ? 'active' : ''} `} >
                        <a
                            onClick={() => props.setCurrentPage(pageNumber)}
                            className="page-link"
                        >
                            {pageNumber}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a
                        className="page-link"
                        onClick={nextPage}
                    >
                        {'>>'}
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;