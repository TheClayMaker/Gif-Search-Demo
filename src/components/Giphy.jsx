import React, {useEffect, useState} from "react";
import axios from "axios";

const Giphy = () => {
    const [searchData, setSearchData] = useState([]);
    const [storedData, setStoredData] = useState([]);
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [isCopy, setIsCopy] = useState(false);
    const [copyText, setCopyText] = useState("");
    const [isStored, setIsStored] = useState(true);
   
    const [selectedIndexPrev, setSelectedIndexPrev] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [selectedIndexNext, setSelectedIndexNext] = useState(2);

    useEffect(() =>{
        const fetchData = async () => {
            setIsError("");
            const queryParameters = new URLSearchParams(window.location.search);
            console.log(queryParameters);
            if (queryParameters.has("q")){
                const q = queryParameters.get("q");
                console.log(q);
                if (Object.keys(q).length !== 0){
                    try {
                        setIsLoading(true);
                        setIsStored(false);
                        const results = await axios("https://api.giphy.com/v1/gifs/search", {
                            params: {
                                api_key: "iRttFlkEbQPcmDCM6B6L0VTgtZETZi4h",
                                q: q,
                                limit: 12
                            }
                        });
                        console.log(results);
                        console.log(results.response.status);
                        setSearchData(results.data.data);
                        setIsLoading(false);
                        if (results.response.status === 429){
                            console.log("too many requests");
                            setIsError(429);
                            setTimeout(() => setIsError(""), 5000);
                        }

                    } catch(err) {
                        setIsError(err.response.status);
                        console.log(err);
                        setTimeout(() => setIsError(""), 5000)
                    }
                }
            }
            else{
                try {
                    const randArray = [];
                    setIsLoading(true);
                    setIsStored(false);
                    for(let i = 0; i < 3; i++){
                        const results = await axios("https://api.giphy.com/v1/gifs/random", {
                            params: {
                                api_key: "iRttFlkEbQPcmDCM6B6L0VTgtZETZi4h"
                            }
                        });
                        console.log(results);
                        randArray.push(results.data.data)
                        console.log(randArray)
                    }
                    setSearchData(randArray);
                    setIsLoading(false);
                } catch(err) {
                    setIsError(err.response.status);
                    console.log(err);
                    setTimeout(() => setIsError(""), 5000)
                }
            }

        }
        fetchData();
    }, []);

    const handlePrev = event =>{
        setIsCopy(false);
        if (selectedIndex === 0){
            setSelectedIndex(searchData.length - 1);
        }
        else{
            setSelectedIndex(selectedIndex - 1);
        }
        if (selectedIndexNext === 0){
            setSelectedIndexNext(searchData.length - 1);
        }
        else{
            setSelectedIndexNext(selectedIndexNext - 1);
        }
        if (selectedIndexPrev === 0){
            setSelectedIndexPrev(searchData.length - 1);
        }
        else{
            setSelectedIndexPrev(selectedIndexPrev - 1);
        }
    }

    const handleNext = event =>{
        setIsCopy(false);
        if (selectedIndex === searchData.length - 1){
            setSelectedIndex(0);
        }
        else{
            setSelectedIndex(selectedIndex + 1);
        }
        if (selectedIndexNext === searchData.length - 1){
            setSelectedIndexNext(0);
        }
        else{
            setSelectedIndexNext(selectedIndexNext + 1);
        }
        if (selectedIndexPrev === searchData.length - 1){
            setSelectedIndexPrev(0);
        }
        else{
            setSelectedIndexPrev(selectedIndexPrev + 1);
        }     
    }

    const renderGifs = () => {
        if (isLoading){
            return <div className="">Loading...</div>
        }
        if (searchData.length === 0)
        {
            return;
        }
        console.log(searchData);
        console.log("selected index: " + selectedIndex)
        console.log("data stored: " + isStored);
        return (
            <div>
                <div type="video/mp4" className="gif">
                    <video key={searchData[selectedIndexPrev].id} className="unselected" loop={true} autoPlay={true} onClick={
                        async src => {
                            window.navigator.clipboard.writeText(searchData[selectedIndexPrev].images.original.url);
                            setCopyText(searchData[selectedIndexPrev].images.original.url);
                            handlePrev();
                            setIsCopy(true);
                        }
                    } src={searchData[selectedIndexPrev].images.looping.mp4}/>
                    <video key={searchData[selectedIndex].id} loop={true} autoPlay={true} onClick={
                        async src => {
                            window.navigator.clipboard.writeText(searchData[selectedIndex].images.original.url);
                            setCopyText(searchData[selectedIndex].images.original.url);
                            setIsCopy(true);
                        }
                    } src={searchData[selectedIndex].images.looping.mp4}/>
                    <video key={searchData[selectedIndexNext].id} className="unselected" loop={true} autoPlay={true} onClick={
                        async src => {
                            window.navigator.clipboard.writeText(searchData[selectedIndexNext].images.original.url);
                            setCopyText(searchData[selectedIndexNext].images.original.url);
                            handleNext();
                            setIsCopy(true);
                        }
                    } src={searchData[selectedIndexNext].images.looping.mp4}/>
                </div>
                <button onClick={handlePrev} className="btn mx-2">Prev</button>
                <button onClick={handleNext} className="btn mx-2">Next</button>
            </div>
        )
    };

    const renderStoredGifs = () => {
        if (isLoading){
            return <div className="">Loading...</div>
        }
        return storedData.map(el => {
            return (
                <div id={el.id}  type="video/mp4" className="stored-gif">
                    <video loop={true} autoPlay={true} onClick={
                        async src => {
                            window.navigator.clipboard.writeText(el.images.original.url);
                            setCopyText(el.images.original.url);
                            setIsCopy(true);
                        }
                    } src={el.images.looping.mp4}/>
                </div>
            )
        })
    };

    const renderError = () => {
        let error = "";
        switch (isError){
            case "400":
                error = "Bad Request";
                break;
            case "401":
                error = "Unauthorized";
                break;
            case "403":
                error = "Forbidden";
                break;
            case "404":
                error = "Not Found";
                break;
            case "414":
                error = "URI Too Long";
                break;
            case "429":
                error = "Too Many Requests";
                break;
            case "":
                error = "";
                break;
        }
        if (error !== ""){
            return (
                <div className="error">
                    Unable to load Gifs. {error} Error Found
                </div>
            );
        }
    };

    const renderCopy = () => {
        if (isCopy){
            return (
                <div className="copied">
                    Copied Gif Url - {copyText}
                </div>
            );
        }
    }

    const handleSeachChange = event => {
        setSearch(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsError("");
        setIsLoading(true);
        if (!isStored){
            for(let i=0;i<searchData.length;i++){
                storedData.push(searchData[i]);
            }
            setIsStored(true);
        }
        try {
            const results = await axios("https://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "iRttFlkEbQPcmDCM6B6L0VTgtZETZi4h",
                q: search,
                limit: 12
            }
        });
        console.log(results);
        setSearchData(results.data.data);
        console.log(searchData)
        } catch (err) {
            setIsError(err.response.status);
            setTimeout(() => setIsError(""), 5000);
        }

        setIsLoading(false);
        setIsStored(false);
        setSelectedIndexPrev(0);
        setSelectedIndex(1);
        setSelectedIndexNext(2);
        setIsCopy(false);
     };

    return (
        <div className="m-2">
            {renderError()}
            <div>
                <div>
                    Powered By GIPHY
                </div>
                <h1>Gif Search Demo</h1>
            </div>
            <form onSubmit="return false;" className="form-inline justify-content-center m-2">
                <input onChange={handleSeachChange} type="text" placeholder="?q=[insert search here]" className="form-control"/>
                <button onClick={handleSubmit} type="submit" className="btn btn-primary mx-2">Submit</button>
            </form>
            <div className="container gifs">
                {renderCopy()}
                {renderGifs()}
            </div>
            <h2>Previous Results</h2>
            <div className="container gifs">
                {renderStoredGifs()}
            </div>
        </div>
    ); 
}

export default Giphy