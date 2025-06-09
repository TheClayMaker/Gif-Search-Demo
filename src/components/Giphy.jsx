import React, {useEffect, useState} from "react";
import axios from "axios";


const Giphy = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isCopy, setIsCopy] = useState(false);

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
                        const results = await axios("http://api.giphy.com/v1/gifs/search", {
                            params: {
                                api_key: "iRttFlkEbQPcmDCM6B6L0VTgtZETZi4h",
                                q: q,
                                limit: 5
                            }
                        });
                        console.log(results);
                        setData(results.data.data);
                        setIsLoading(false);

                    } catch(err) {
                        setIsError(true);
                        console.log(err);
                        setTimeout(() => setIsError(false), 5000)
                    }
                }
            }

        }
        fetchData();
    }, []);

    const renderGifs = () => {
        if (isLoading){
            return <div className="">Loading...</div>
        }
        return data.map(el => {
            return (
                <div key={el.id}  type="video/mp4" className="gif">
                    <video loop="true" autoplay="true" onClick={
                        async src => {
                            window.navigator.clipboard.writeText(el.images.downsized.url);
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
                    Copied Gif Url!
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

        try {
            const results = await axios("https://api.giphy.com/v1/gifs/search", {
            params: {
                api_key: "iRttFlkEbQPcmDCM6B6L0VTgtZETZi4h",
                q: search,
                limit: 5
            }
        });
        console.log(results);
        setData(results.data.data);
        } catch (err) {
            setIsError(true);
            setTimeout(() => setIsError(false), 5000);
        }

        setIsLoading(false);
     };

    return (
        <div className="m-2">
            {renderError()}
            {renderCopy()}
            <h1>Gif Search Demo</h1>
            <form className="form-inline justify-content-center m-2">
                <input onChange={handleSeachChange} type="text" placeholder="Search" className="form-control"/>
                <button onClick={handleSubmit} type="submit" className="btn btn-primary mx-2">Submit</button>
            </form>
            <div>(You can also search by adding ?q=[query] to the url)</div>
            <div className="container gifs">
                {renderGifs()}
            </div>
        </div>
    ); 
}

export default Giphy