import { useEffect, useState } from "react";
import { Button, Container, Form, Pagination, Row } from "react-bootstrap";
import Student from "./Student"

const Classroom = () => {
    const [studentArr, setStudentArr] = useState([]);
    const [showStudents, setShowStudents] = useState([]);
    const [slicedStudents, setSlicedStudents] = useState([]);
    const [searchMajor, setSearchMajor] = useState("");
    const [searchInterest, setSearchInterest] = useState("");
    const [searchName, setSearchName] = useState("");
    const [page, setPage] = useState(1);
    const getStudentData = function () {
        fetch("https://cs571.org/api/f23/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json())
            .then(data => {
                setStudentArr(data)
                setShowStudents(data)
                setSlicedStudents(data.slice(0, 24))
            })
    }

    const onSearchChange = function () {
        let copy = [...studentArr];
        if (searchName.length != 0) {
            copy = copy
                .filter((student) => (student.name.first + ' ' + student.name.last).toLowerCase().includes(searchName.toLowerCase()))
        }
        if (searchMajor.length != 0) {
            copy = copy
                .filter((student) => student.major.toLowerCase().includes(searchMajor.toLowerCase()))
        }
        if (searchInterest.length != 0) {
            copy = copy
                .filter((student) => student.interests.some((e) => e.toLowerCase().includes(searchInterest.toLowerCase())))
        }
        setShowStudents(copy)
        setSlicedStudents(copy.slice(0, 24))
    }


    useEffect(getStudentData, [])

    useEffect(() => {
        setSlicedStudents(showStudents.slice((page - 1) * 24, page * 24))
    }, [page])



    useEffect(onSearchChange, [searchName, searchMajor, searchInterest])





    return <div>
        <h1>Badger Book - Fall 2023</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value.trim())} />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor"
                value={searchMajor}
                onChange={(e) => setSearchMajor(e.target.value.trim())} />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest"
                value={searchInterest}
                onChange={(e) => setSearchInterest(e.target.value.trim())} />
            <br />
            <Button variant="neutral" onClick={getStudentData}>Reset Search</Button>
        </Form>
        <Container fluid>
            <span>There are {showStudents.length} student(s) matching your search.</span>
            <Row xs={12} sm={6} md={4} lg={3} xl={6}>
                {slicedStudents.map((student) => {
                    return <Student name={student.name}
                        key={student.id}
                        interests={student.interests}
                        major={student.major}
                        numCredits={student.numCredits}
                        fromWisconsin={student.fromWisconsin}></Student>
                })}
            </Row>
            <Pagination>
                <Pagination.Item onClick={() => setPage((oldPage) => oldPage - 1)}
                    disabled={page == 1 || showStudents.length == 0}>Previous</Pagination.Item>
                {
                    Array.from({ length: Math.ceil(showStudents.length / 24) }, (_, i) => i + 1).map((index) => {
                        return <Pagination.Item key={index} active={page === index}
                            onClick={() => setPage(index)}>{index}</Pagination.Item>
                    })
                }
                <Pagination.Item onClick={() => setPage((oldPage) => oldPage - 1)}
                    disabled={page == Math.ceil(showStudents.length / 24) || showStudents.length == 0}>Next</Pagination.Item>
            </Pagination>
        </Container>
    </div>

}

export default Classroom