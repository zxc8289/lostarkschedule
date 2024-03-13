import { Card, ListGroup, Pagination } from "react-bootstrap";
import patchData from "../const/patchData";
import { useState } from "react";
import NProgress from 'nprogress';

function PatchLog() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 페이지당 보여줄 아이템의 수

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = patchData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(patchData.length / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4 custom-container" style={{ paddingTop: 70 }}>
      {currentItems.map((data, index) => (
        <Card key={index} className="mb-4">
          <Card.Header>{data.date}</Card.Header>
          <ListGroup variant="flush">
            {data.patches.map((patch, idx) => (
              <ListGroup.Item key={idx}>{patch}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      ))}
      <Pagination className="justify-content-center" color="black">
        {[...Array(totalPages).keys()].map((num) => (
          <Pagination.Item
            key={num + 1}
            active={num + 1 === currentPage}
            onClick={() => handlePageClick(num + 1)}
            className="pagination-item"
          >
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>

    </div>
  );
}

export default PatchLog;
