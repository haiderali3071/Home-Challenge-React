import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./Home.scoped.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import moment from "moment";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { DATA_SOURCE1, DATA_SOURCE2, getToken, openPage } from "../../utilities/config";
import Spinner from "react-bootstrap/Spinner";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const options = [
    "Advanced search",
    "Customize your feed"
];

function Home() {
    const sources_error = "You can only select upto 20 sources!";
    const [value, setValue] = useState(0);
    const [show, setShow] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sources, setSources] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [initialLoading, setInitalLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [storiesLoading, setStoriesLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [personlizedFeed, setPersonalizedFeed] = useState([]);
    const [feedMenuShow, setFeedMenuShow] = useState(false);
    const [feedSources, setFeedSources] = useState([]);
    const [feedCategories, setFeedCategories] = useState([]);
    const [prefLoading, setPrefLoading] = useState(false);
    const [emptyPrefError, setEmptyPrefError] = useState(false);
    const [feedLoading, setFeedLoading] = useState(false);
    const [initialTotalPages, setInitiaTotalPages] = useState(1); //for filtered news page
    const [page, setPage] = useState(1); //for filtered news page
    const [feedPage, setFeedPage] = useState(1); //for filtered news page
    const [fetchPrefLoading, setFetchPrefLoading] = useState(true);
    const [tab1LoadMore, setTab1LoadMore] = useState(false);
    const [tab2LoadMore, setTab2LoadMore] = useState(false);

    useEffect(() => {
        (async () => {
            if (value === 2 && personlizedFeed.length === 0) {
                // load personalized feed 
                await loadFeed();
            }
        })()
    }, [value, prefLoading])

    useEffect(() => {
        (async () => {
            try {
                let options = {
                    method: "GET",
                    url: process.env.REACT_APP_URL + "/api/get-top-stories",
                    headers: {
                        Authorization: "Bearer " + getToken()
                    }
                };
                let response = await axios.request(options);
                setStories(response.data.data.results);
            }
            catch (err) {
                alert("Error occured!");
            }
            finally {
                setStoriesLoading(false);
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                let options = {
                    method: "GET",
                    url: process.env.REACT_APP_URL + "/api/get-categories",
                    headers: {
                        Authorization: "Bearer " + getToken()
                    }
                };
                let response = await axios.request(options);
                setCategories(response.data.data);

                options = {
                    method: "GET",
                    url: process.env.REACT_APP_URL + "/api/get-sources",
                    headers: {
                        Authorization: "Bearer " + getToken()
                    }
                };
                response = await axios.request(options);
                setSources(response.data.data);
            }
            catch (err) {
                alert("Error occured!");
                console.error(err);
            }
            finally {
                setInitalLoading(false)
            }
        })();
    }, [])

    useEffect(() => {
        (async () => {
            try {
                let options = {
                    method: "GET",
                    url: process.env.REACT_APP_URL + "/api/get-preferences",
                    headers: {
                        Authorization: "Bearer " + getToken()
                    }
                };
                let response = await axios.request(options);
                if (response.data.success) {
                    setFeedCategories(response.data.data.categories);
                    setFeedSources(response.data.data.sources);
                }
            }
            catch (err) {
                alert("Error occured!");
                console.error(err);
            }
            finally {
                setFetchPrefLoading(false)
            }
        })();
    }, [])

    async function loadFeed() {
        try {
            setFeedLoading(true);

            const data = {
                page: 1
            }
            const options = {
                method: "POST",
                url: process.env.REACT_APP_URL + "/api/get-personalized-news-feed",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getToken()
                },
                data
            };

            const response = await axios(options);
            if (response.data.success) {
                setEmptyPrefError(false);
                setPersonalizedFeed(response.data.data.articles);
                setFeedPage(1);
            }
        } catch (err) {
            if (err.response.data.message === "empty_preferences") {
                setEmptyPrefError(true);
                return;
            }
            alert("Error occured!");
        }
        finally {
            setFeedLoading(false);
        }
    }

    async function loadMoreFeed(page_no) {
        try {
            setTab1LoadMore(true);

            const data = {
                page: page_no
            }
            const options = {
                method: "POST",
                url: process.env.REACT_APP_URL + "/api/get-personalized-news-feed",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getToken()
                },
                data
            };

            const response = await axios(options);
            if (response.data.success) {
                setPersonalizedFeed([...personlizedFeed, ...response.data.data.articles]);
            }
        } catch (err) {
            console.error(err)
        }
        finally {
            setTab1LoadMore(false);
        }
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true);
    }

    const handleFeedMenuShow = () => {
        setFeedMenuShow(true);
    }

    const handleFeedMenuClose = () => {
        setFeedMenuShow(false);
    }

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleDotMenuClose = () => {
        setAnchorEl(null);
    };

    const applyFilter = async () => {
        setSearchLoading(true);
        const data = {
            keyword: keyword === "" ? null : keyword,
            category: selectedCategory === "" ? null : selectedCategory,
            sources: selectedSources.length === 0 ? null : selectedSources.toString().replaceAll(",", ", "),
            from,
            to,
            page: 1,
            initial_total_pages: 1,
        };

        if (data.keyword === null && data.category === null) {
            alert("Please either search something or select category");
            setSearchLoading(false);
            return;
        }

        handleClose();

        const options = {
            method: "POST",
            url: process.env.REACT_APP_URL + "/api/get-filtered-news",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken()
            },
            data
        };

        try {
            const response = await axios.request(options);
            let articles = [];
            if (response.data.message === DATA_SOURCE2) {
                articles = response.data?.data?.articles;
            }
            else if (response.data.message === DATA_SOURCE1) {
                setInitiaTotalPages(response.data?.data?.response?.pages);
                articles = response.data?.data?.response?.results;
            }
            setValue(1);
            setArticles(articles);
            setPage(1);
        }
        catch (err) {
            alert("Error occured!");
            console.log(err)
        }
        finally {
            setSearchLoading(false);
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDropdownChange = (event) => {
        const { target: { value } } = event;
        if (value.length > 20) {
            alert(sources_error);
            return;
        }
        setSelectedCategory("");
        setSelectedSources(value);
    };

    const handleCategoryDropdownChange = (e) => {
        setSelectedSources([]);
        setSelectedCategory(e.target.value);
    };

    const handleFeedSourcesDropdownChange = (event) => {
        const { target: { value } } = event;
        if (value.length > 20) {
            alert(sources_error);
            return;
        }
        setFeedSources(value);
    };

    const handleFeedCategoriesDropdownChange = (event) => {
        const { target: { value } } = event;
        setFeedCategories(value);
    };

    const openAdvancedSearchMenu = () => {
        handleShow();
    }

    const openCustomizeFeedMenu = () => {
        handleFeedMenuShow();
    }

    const savePreferences = async () => {
        if (feedSources.length === 0 && feedCategories.length === 0) {
            alert("Please, select either at least one category or source!");
            return;
        }

        setPrefLoading(true);

        const data = {
            categories: feedCategories,
            sources: feedSources
        }
        const options = {
            method: "POST",
            url: process.env.REACT_APP_URL + "/api/set-preferences",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken()
            },
            data
        };
        try {
            const response = await axios.request(options);
            if (response.data.success) {
                handleFeedMenuClose();
                await loadFeed();
            }
        }
        catch (err) {
            alert(err.response.data.message || "Error occured!");
        }
        finally {
            setPrefLoading(false);
        }
    }

    async function loadMoreFilteredNews() {
        const data = {
            keyword: keyword === "" ? null : keyword,
            category: selectedCategory === "" ? null : selectedCategory,
            sources: selectedSources.length === 0 ? null : selectedSources.toString().replaceAll(",", ", "),
            from,
            to,
            page: page + 1,
            initial_total_pages: initialTotalPages,
        };
        setPage(page + 1);
        if (data.keyword === null && data.category === null) {
            return;
        }
        setTab2LoadMore(true);
        const options = {
            method: "POST",
            url: process.env.REACT_APP_URL + "/api/get-filtered-news",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken()
            },
            data
        };
        try {
            const response = await axios.request(options);
            let more_articles = [];
            if (response.data.message === DATA_SOURCE2) {
                more_articles = response.data?.data?.articles;
            }
            else if (response.data.message === DATA_SOURCE1) {
                setInitiaTotalPages(response.data?.data?.response?.pages);
                more_articles = response.data?.data?.response?.results;
            }
            setArticles([...articles, ...more_articles]);
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setTab2LoadMore(false);
        }
    }

    return (
        <Box className="center" sx={{ width: "100%" }}>
            <div className="search-div">
                <input type="text" className="search-bar" placeholder="Search here" onChange={(e) => setKeyword(e.target.value)} onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        applyFilter();
                    }
                }} />
                <Spinner
                    className={searchLoading ? "ms-2" : "visually-hidden ms-2"}
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginBottom: 12 }}
                />
                {!searchLoading && <AiOutlineSearch size={30} className="mb-1 ms-2" style={{ cursor: "pointer" }} onClick={applyFilter} />}

                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <HiOutlineDotsHorizontal />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleDotMenuClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                        },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option} selected={option === "Pyxis"} onClick={() => {
                            handleDotMenuClose();
                            if (option === options[0]) {
                                openAdvancedSearchMenu();
                            }
                            else {
                                openCustomizeFeedMenu();
                            }
                        }}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            <Box className="box" sx={{ borderBottom: 1, borderColor: "divider" }} >
                <div>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab className="tab" label="Top Stories" {...a11yProps(0)} />
                        <Tab className="tab" label="Filtered News" {...a11yProps(1)} />
                        <Tab className="tab" label="Personalized Feed" {...a11yProps(2)} />
                    </Tabs>
                </div>
            </Box>
            <TabPanel value={value} index={0}>
                {
                    !storiesLoading ? (
                        stories.length !== 0 ? (
                            stories.map((item) => {
                                return (
                                    <div className="tile" onClick={() => {
                                        openPage(item.short_url);
                                    }}>
                                        {item.title}
                                    </div>
                                )
                            })
                        ) : (
                            <h5>Nothing to show!</h5>
                        )
                    ) :
                        (<Spinner animation="grow" variant={"primary"} className="spinner" />)
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className="d-flex flex-column align-items-center">
                    {
                        !searchLoading ? (
                            articles.length !== 0 ? (articles.map((item) => {
                                return (
                                    <div className="tile" onClick={() => {
                                        openPage(item.webUrl ? item.webUrl : item.url);
                                    }}>
                                        {item.webTitle ? item.webTitle : item.title}
                                    </div>
                                )
                            })) : (
                                <h5>Nothing to show!</h5>
                            )
                        ) : (<Spinner animation="grow" variant={"primary"} className="spinner" />)
                    }

                    {
                        !searchLoading && articles.length !== 0 && (
                            <button type="button" className="btn btn-primary align-self-center" onClick={loadMoreFilteredNews}>
                                <Spinner
                                    className={tab2LoadMore ? "me-2" : "visually-hidden me-2"}
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Load more
                            </button>
                        )
                    }
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className="d-flex flex-column align-items-center">
                    {
                        !feedLoading && emptyPrefError && (
                            <div className="d-flex flex-column align-items-center">
                                <h5>You didn't customize your feed</h5>
                                <button type="button" className="btn btn-primary" onClick={openCustomizeFeedMenu}>Customize personalized feed</button>
                            </div>
                        )
                    }

                    {
                        !feedLoading ? (
                            personlizedFeed.length !== 0 ? (personlizedFeed.map((item) => {
                                return (
                                    <div className="tile" onClick={() => {
                                        openPage(item.url);
                                    }}>
                                        {item.title}
                                    </div>
                                )
                            })) : !emptyPrefError && (
                                <h5>Nothing to show!</h5>
                            )
                        ) : (<Spinner animation="grow" variant={"primary"} className="spinner" />)
                    }

                    {
                        !feedLoading && personlizedFeed.length !== 0 && (
                            <button type="button" className="btn btn-primary align-self-center" onClick={() => {
                                loadMoreFeed(feedPage + 1);
                                setFeedPage(feedPage + 1);
                            }}>
                                <Spinner
                                    className={tab1LoadMore ? "me-2" : "visually-hidden me-2"}
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Load more
                            </button>
                        )
                    }
                </div>
            </TabPanel>

            {/* Advanced search modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter</Modal.Title>
                </Modal.Header>
                {
                    initialLoading ? (
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Spinner animation="grow" variant={"primary"} className="spinner my-5" />
                        </div>
                    ) : (
                        <Modal.Body>
                            <div className="center">
                                <div>
                                    <h5>Select Categories</h5>
                                    <Select
                                        className="dropdown"
                                        displayEmpty
                                        value={selectedCategory}
                                        onChange={handleCategoryDropdownChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>Select</em>;
                                            }

                                            return selected;
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {categories.map((item) => (
                                            <MenuItem
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="mt-4">
                                    <h5>Select Sources</h5>
                                    <Select
                                        className="dropdown"
                                        multiple
                                        displayEmpty
                                        value={selectedSources}
                                        onChange={handleDropdownChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>Select</em>;
                                            }

                                            return selected.join(", ");
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {sources.map((item) => (
                                            <MenuItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="mt-4">
                                    <h5>Dates</h5>
                                    <h6 className="mt-3">From</h6>
                                    <input value={from} onChange={(e) => setFrom(e.target.value)} className="date-input" type="date" max={moment().format("YYYY-MM-DD")} />
                                    <h6 className="mt-2">To</h6>
                                    <input value={to} onChange={(e) => setTo(e.target.value)} className="date-input" type="date" min={from} max={moment().format("YYYY-MM-DD")} />
                                </div>
                            </div>
                        </Modal.Body>
                    )
                }
                <Modal.Footer>
                    <Button variant="primary" onClick={applyFilter}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Customize feed modal */}
            <Modal show={feedMenuShow} onHide={handleFeedMenuClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Customize personalized feed</Modal.Title>
                </Modal.Header>
                {
                    initialLoading || fetchPrefLoading ? (
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <Spinner animation="grow" variant={"primary"} className="spinner my-5" />
                        </div>
                    ) : (
                        <Modal.Body>
                            <div className="center">
                                <div>
                                    <h5>Select Categories</h5>
                                    <Select
                                        className="dropdown"
                                        multiple
                                        displayEmpty
                                        value={feedCategories}
                                        onChange={handleFeedCategoriesDropdownChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>Select</em>;
                                            }

                                            return selected.join(", ");
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {categories.map((item) => (
                                            <MenuItem
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="mt-4">
                                    <h5>Select Sources</h5>
                                    <Select
                                        className="dropdown"
                                        multiple
                                        displayEmpty
                                        value={feedSources}
                                        onChange={handleFeedSourcesDropdownChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>Select</em>;
                                            }

                                            return selected.join(", ");
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {sources.map((item) => (
                                            <MenuItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                        </Modal.Body>
                    )
                }
                <Modal.Footer>
                    <Button variant="primary" onClick={savePreferences}>
                        <Spinner
                            className={prefLoading ? "" : "visually-hidden"}
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> Save
                    </Button>
                </Modal.Footer>
            </Modal>

        </Box>
    );
}

export default Home;