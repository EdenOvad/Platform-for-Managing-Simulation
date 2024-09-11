import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Row, Col, Card, ListGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { jwtDecode } from 'jwt-decode';


interface ExperimentDetailsProps {
    simulation_name: string;
    date: string;
    params: string;
    result: string;
    path: string;
    state: string;
    user_id: string;
    start_time: string;
    end_time: string;
}

interface DecodedToken {
    user_id: string;
}

const ExperimentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [experiment, setExperiment] = useState<ExperimentDetailsProps | null>(null);
    const [outputFiles, setOutputFiles] = useState<string[]>([]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [params, setParams] = useState({
        simulation_name: "",
        num_jobs: "",
        num_tors: "32",
        num_cores: "1",
        ring_size: "2",
        routing: "ecmp",
        path: "",
        seed: "0"
    });
    const [show, setShow] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate();
    const user_info = useSelector((data: RootState) => data.user_id);
    const storage = localStorage.getItem("token");

    const decodedToken: DecodedToken = jwtDecode(String(storage));
    const uid: string = decodedToken.user_id;

    useEffect(() => {
        const fetchExperimentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get_experiment/${id}`);
                setExperiment(response.data);
                const fetchedExperiment: ExperimentDetailsProps = {
                    ...response.data,
                    state: response.data.state || 'Finished'  // Default to 'finished' if state is not provided
                };
                setExperiment(fetchedExperiment);
                if (response.data.path) {
                    const encodedPath = encodeURIComponent(response.data.path);
                    const filesResponse = await axios.get(`http://localhost:8000/api/get_files/${encodedPath}`);
                    setOutputFiles(filesResponse.data.files);
                }
            } catch (error) {
                console.error('Error fetching experiment details:', error);
            }
        };

        fetchExperimentDetails();
    }, [id]);

    const handleFileClick = async (filePath: string) => {
        try {
            const encodedFilePath = encodeURIComponent(filePath);
            const response = await axios.get(`http://localhost:8000/api/get_file_content/${encodedFilePath}`);
            setFileContent(response.data.content);
            setShowContent(true);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    // const handleUploadToGoogleDrive = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:8000/api/upload_to_google_drive', { files: outputFiles });
    //         console.log('Files uploaded successfully:', response.data);
    //     } catch (error) {
    //         console.error('Error uploading to Google Drive:', error);

    //     }
    // };

    const handleRerun = async () => {
        if (!experiment) return;
        try {
            setExperiment({
                ...experiment,
                state: 'Re-Running'
            });
            const response = await axios.post("http://localhost:8000/api/re_run_simulation", { data: experiment.path, simulation_id: id, user_id: uid });
            setExperiment({
                ...experiment,
                result: response.data.result,
                start_time: response.data.start_time,
                end_time: response.data.end_time,
                state: 'Finished'
            });

        } catch (error) {
            setExperiment({
                ...experiment,
                state: 'Crushed'
            })
            console.error('Error re-running experiment:', error);
        }

    };
    const handleEdit = () => {
        if (experiment) {

            const updatedata = experiment.params.split(',');
            setParams({
                simulation_name: experiment.simulation_name,
                num_jobs: updatedata[0],
                num_tors: "32",
                num_cores: updatedata[1],
                ring_size: updatedata[2],
                routing: updatedata[3],
                path: experiment.path,
                seed: updatedata[4]
            });
            setShow(true);
        }
    };

    const handleSaveEdit = async () => {
        if (!experiment) return;

        // Close the modal immediately
        handleClose();

        // Optimistically update the state with new params
        const updatedParams = `${params.num_jobs},${params.num_cores},${params.ring_size},${params.routing},${params.seed}`;
        const updatedExperiment = {
            ...experiment,
            simulation_name: params.simulation_name,
            params: updatedParams,
            state: 'Running'
        };

        setExperiment(updatedExperiment);

        try {
            const response = await axios.post("http://localhost:8000/api/simulation_update", { params, simulationID: id, user_id: uid });

            // Ensure the state is properly updated with the response data, providing defaults for potentially undefined values
            setExperiment(prev => ({
                simulation_name: response.data.simulation_name || prev?.simulation_name || "",
                params: response.data.params || prev?.params || "",
                start_time: response.data.start_time || prev?.start_time || "",
                end_time: response.data.end_time || prev?.end_time || "",
                date: response.data.date || prev?.date || "",
                result: response.data.result || prev?.result || "",
                path: response.data.path || prev?.path || "",
                user_id: response.data.user_id || prev?.user_id || "",
                state: 'Finished' || prev?.user_id || ""
            }));
        } catch (error) {
            setExperiment({
                ...experiment,
                state: 'Crushed'
            })
            console.error('Error updating experiment:', error);
        }
    };


    const handleDelete = async () => {
        if (!experiment) return;
        try {
            await axios.post("http://localhost:8000/api/delte_simulation", { data: id, user_id: uid });
            navigate('/simulation', { state: uid }); // Navigate back to the main page after deletion
        } catch (error) {
            console.error('Error deleting experiment:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setParams({
            simulation_name: "",
            num_jobs: "",
            num_tors: "32",
            num_cores: "1",
            ring_size: "2",
            routing: "ecmp",
            path: "",
            seed: "0"
        });
    };

    const handleCloseContent = () => setShowContent(false);

    const handlesimulation = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setParams({ ...params, [event.target.name]: event.target.value });
    };

    if (!experiment) return <div>Loading...</div>;

    const paramsArray = experiment.params ? experiment.params.split(',') : [];
    const displayParams = {
        Num_Jobs: paramsArray[0] || "",
        Num_Cores: paramsArray[1] || "",
        Num_Rings: paramsArray[2] || " ",
        Algorithm: paramsArray[3] || "",
        Seed: paramsArray[4] || ""
    };
    const getStateColor = (state: string) => {
        switch (state) {
            case 'Running':
                return 'green'; // Color for 'Running' state
            case 'Re-Running':
                return 'green';
            case 'Finished':
                return 'red'; // Color for 'Finished' state
            case 'Crushed':
                return 'gray'; // Color for 'Error' state
        }
    };
    const getLastFolder = (path: string) => { // Function to get the last folder from a path
        const parts = path.split('/');
        return parts[parts.length - 1];
    };
    const formatTime = (time: string) => { // Function to format time without decimal places
        return time.split('.')[0];
    };
    return (
        <Container>
            <Row className="my-3">
                <Col>

                    <Button variant="primary" className="mx-14 mb-2" onClick={() => navigate('/simulation')}>
                        Home
                    </Button>
                    <h3><p>Simulation Name: {experiment.simulation_name}</p></h3>
                    <Card>
                        <Card.Body>
                            <h5>Summary</h5>
                            <p>Date: {experiment.date}</p>
                            <p>Start time: {formatTime(experiment.start_time)}</p> {/* Displaying formatted start time */}
                            <p>End time: {formatTime(experiment.end_time)}</p> {/* Displaying formatted end time */}
                            <p>
                                State: <span style={{ color: getStateColor(experiment.state) }}>{experiment.state}</span>

                            </p>

                        </Card.Body>
                    </Card>
                    <Card className="my-3">
                        <Card.Body>
                            <h5>Parameters</h5>
                            <ul>
                                {Object.entries(displayParams).map(([key, value]) => (
                                    <li key={key}>
                                        {key}: {value}
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="my-3">
                        <Card.Body>

                            <h5>Actions</h5>
                            <Button variant="primary" className="mx-15 mb-2" onClick={handleRerun}>
                                Re-run
                            </Button>
                            <Button variant="secondary" className="mx-5 mb-2" onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button variant="danger" className="mx-15 mb-2" onClick={handleDelete}>
                                Delete
                            </Button>
                            {/* <Button variant="success" className="mx-5 mb-2" onClick={handleUploadToGoogleDrive}>
                            Upload to Google Drive
                        </Button> */}
                        </Card.Body>
                    </Card>
                    <Card className="my-3">
                        <Card.Body>
                            <h5>Output Files</h5>
                            <ListGroup>
                                {outputFiles.map((file, index) => (
                                    <ListGroup.Item key={index}>
                                        <Button variant="link" onClick={() => handleFileClick(file)}>
                                            {getLastFolder(file)}
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editing Simulation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Simulation Name:</label>
                    <input className='form-control' name='simulation_name' onChange={handlesimulation} value={params.simulation_name} required />
                    <label>Num_Jobs</label>
                    <input className='form-control' type='number' onChange={handlesimulation} max={8} name='num_jobs' value={params.num_jobs} required />
                    <label>Num_Cores</label>
                    <select className='form-control' onChange={handlesimulation} name='num_cores' value={params.num_cores} required>
                        <option>0</option>
                        <option>1</option>
                        <option>4</option>
                        <option>8</option>
                    </select>
                    <label>Num_Rings</label>
                    <select className='form-control' onChange={handlesimulation} name='ring_size' value={params.ring_size} required>
                        <option>2</option>
                        <option>4</option>
                        <option>8</option>
                    </select>
                    <label>Algorithm</label>
                    <select className='form-control' onChange={handlesimulation} name='routing' value={params.routing} required>
                        <option>ecmp</option>
                        <option>edge_coloring</option>
                        <option>ilp_solver</option>
                        <option>mcvlc</option>
                        <option>simulated_annealing</option>
                    </select>
                    <label>Seed</label>
                    <select className='form-control' onChange={handlesimulation} name='seed' value={params.seed} required>
                        <option value="0">0</option>
                        <option value="42">42</option>
                        <option value="200">200</option>
                        <option value="404">404</option>
                        <option value="1234">1234</option>
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showContent} onHide={() => setShowContent(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>File Content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre>{fileContent}</pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowContent(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ExperimentDetails;
