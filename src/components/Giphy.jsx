import React, {useEffect, useState} from "react";
import axios from "axios";


const Giphy = () => {
    const [searchData, setSearchData] = useState([]);
    const [storedData, setStoredData] = useState([]);
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [copyText, setCopyText] = useState("");
    const [isStored, setIsStored] = useState(true);

    useEffect(() =>{
        const fetchData = async () => {
            setIsError(false);
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
                                limit: 3
                            }
                        });
                        console.log(results);
                        setSearchData(results.data.data);
                        setIsLoading(false);

                    } catch(err) {
                        setIsError(true);
                        console.log(err);
                        setTimeout(() => setIsError(false), 5000)
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
                    setIsError(true);
                    console.log(err);
                    setTimeout(() => setIsError(false), 5000)
                }
            }

        }
        fetchData();
    }, []);

    const renderGifs = () => {
        if (isLoading){
            return <div className="">Loading...</div>
        }
        if (!isStored){
            for(let i = 0; i < searchData.length; i++){
                storedData.push(searchData[i])
            }
            setIsStored(true);
        }
        return searchData.map(el => {
            return (
                <div key={el.id}  type="video/mp4" className="gif">
                    <video loop={true} autoPlay={true} onClick={
                        async src => {
                            window.navigator.clipboard.writeText(el.images.downsized.url);
                            setCopyText(el.images.downsized.url);
                            setIsCopy(true);
                        }
                    } src={el.images.looping.mp4}/>
                </div>
            )
        })
    };

    const renderStoredGifs = () => {
        if (isLoading){
            return <div className="">Loading...</div>
        }
        return storedData.map(el => {
            return (
                <div key={el.id}  type="video/mp4" className="gif">
                    <video loop={true} autoPlay={true} onClick={
                        async src => {
                            window.navigator.clipboard.writeText(el.images.downsized.url);
                            setCopyText(el.images.downsized.url);
                            setIsCopy(true);
                        }
                    } src={el.images.looping.mp4}/>
                </div>
            )
        })
    };

    const renderError = () => {
        if (isError){
            return (
                <div>
                    Unable to load Gifs.
                </div>
            );
        }
    };

    const renderCopy = () => {
        if (isCopy){
            return (
                <div>
                    Copied Gif Url ${copyText}!
                </div>
            );
        }
    }

    const handleSeachChange = event => {
        setSearch(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsError(false);
        setIsLoading(true);
        setIsStored(false);
        try {
            const results = await axios("https://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "iRttFlkEbQPcmDCM6B6L0VTgtZETZi4h",
                q: search,
                limit: 3
            }
        });
        console.log(results);
        setSearchData(results.data.data);
        console.log(searchData)
        } catch (err) {
            setIsError(true);
            setTimeout(() => setIsError(false), 5000);
        }

        setIsLoading(false);
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
            <form onsubmit="return false;" className="form-inline justify-content-center m-2">
                <input onChange={handleSeachChange} type="text" placeholder="Search" className="form-control"/>
                <button onClick={handleSubmit} type="submit" className="btn btn-primary mx-2">Submit</button>
            </form>
            <div>(You can also search by adding ?q=[query] to the url)</div>
            <div className="container gifs">
                {renderCopy()}
                {renderGifs()}
            </div>
            <div>Previous Results</div>
            <div>
                {renderStoredGifs()}
            </div>
        </div>
    ); 
}

export default Giphy