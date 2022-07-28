import React, { Component } from "react";
import Axios from "axios";
import AutoCompleteItem from "./autoCompleteItem";
import TopSearchBar from "./topSearchBar";
import logo from "../../src/logo.png";
import './style.css'

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      searchResults: null,
      loadAutoCompleteList: false,
      autoCompleteResults: null,
      loadTopSearchBar: false,
      loading: false
    };
  }

  onChangeInput = (event) => {
    this.setState({
      searchInput: event.target.value,
      loadAutoCompleteList: true,
      // loading: true 
    });
    Axios({
      method: "POST",
      data: {
        autoCompleteKey: event.target.value,
      },
      url: "http://localhost:5000/autoComplete"
    }).then((res) => {
      let autoCompleteList = [];
      for (var i=1; i<=res.data["autoCompleteList"].length; i++){
        autoCompleteList.push({ id: i, suggestion: res.data["autoCompleteList"][i-1] })
      }
      this.setState({ 
        autoCompleteResults: autoCompleteList, 
        // loadAutoCompleteList: false,
        // loading: false 
      });
    });
  };

  onSearch = () => {
    if(this.state.searchInput === ''){
      alert("Please enter something to search")
    }else{
      this.setState({
        loadTopSearchBar: true,
        loading: true
      });

      let inputKey = this.state.searchInput.split(" ");
      let urlForSearch = "http://localhost:5000/searchWord"; // Port 5000 is the default port for Python Flask app	
      if (inputKey.includes("AND") || inputKey.includes("OR") || inputKey.includes("")){
        urlForSearch = "http://localhost:5000/binarySearch"
      }

      Axios({
        method: "POST",
        data: {
          searchInput: this.state.searchInput,
        },
        url: urlForSearch, 
      }).then((res) => {
        // console.log(res.data["result"]);
        this.setState({ 
          searchResults: res.data["result"], 
          loading: false,
          loadAutoCompleteList: false,
        });
        console.log(">>> res.data : ", res.data);
        this.customEngine(res.data.result)
      });
    }
  };

  // updateSearchResults = (newSearchResults) => {
  //   this.setState({searchResults: newSearchResults});
  // }

  onLoadSuggestion = (suggestion) => {
    this.setState({ searchInput: suggestion });
  };

   queryToGoogleBing =() => {
    var input = document.getElementById("country").value;
    console.log(">> input G ", input);
    document.getElementById("google").src = "https://www.google.com/search?igu=1&source=hp&ei=lheWXriYJ4PktQXN-LPgDA&q=" + input;
    document.getElementById("bing").src = "https://www.bing.com/search?q=" + input;
}

 customEngine=(data)=> {
  var countriesIFrame = document.getElementById("countries").contentWindow.document;
  let frameElement = document.getElementById("countries");
  let doc = frameElement.contentDocument;
  doc.body.innerHTML = doc.body.innerHTML + '<style>a {margin: 0px 0px 0px 0px;}</style>';
  countriesIFrame.open();
  var out = "";
  var i;
  for (i = 0; i < data.length; i++) {
      out += '<a target="_blank" href="' + data[i].url + '">' +
          data[i].title + '</a><br>' + "<p>" + data[i].url + "<br>" + data[i].description + "</p>";
          // data[i].meta_info + "</p>";
  }
  countriesIFrame.write(out);
  countriesIFrame.close();
}
  render() {
    const isTopSearchBarLoaded = this.state.loadTopSearchBar;
    // if (isTopSearchBarLoaded && this.state.searchResults) {
    //   return (
    //     <div>
    //       <TopSearchBar
    //         searchInput={this.state.searchInput}
    //         autoCompleteList={this.props.autoCompleteList}
    //         searchResults={this.state.searchResults}
    //         // updateSearchResults={this.updateSearchResults}
    //       />

    //     </div>
    //   );
    // } else {
      return (
        <div>
        {/* Required meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* Bootstrap CSS */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
        <link rel="stylesheet" href="style.css" />
        
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
        <title>Countries</title>
        <h1 className="title">Byte Engine</h1>
        <form id="form" onsubmit="return true;">
          <div className="form-group d-flex">
            <input type="text" 
            className="form-control col-xs-2" 
            id="country"
            value={this.state.searchInput}
            onChange={this.onChangeInput}
             placeholder="Enter Country" />

            <button type="button" className="btn btn-primary" 
            
            onClick={()=>{
              this.onSearch()
              this.queryToGoogleBing()
              return false
            }} >Search</button>
          </div>
        </form>
        <br />
        {this.state.loadAutoCompleteList && this.state.autoCompleteResults && (	
                <ul className="auto-complete-list">	
                  {this.state.autoCompleteResults.map((each) => (	
                    <AutoCompleteItem	
                      key={each.id}	
                      suggestion={each.suggestion}	
                      onLoadSuggestion={this.onLoadSuggestion}	
                    />	
                  ))}	

                  </ul>
             )
    }
      
        <div className="d-flex">
          <div className="custom">
            <iframe id="countries" />
          </div>
          <div className="google_bing">
            <div>
              <iframe id="google" src="https://www.google.com/search?igu=1&source=hp&ei=lheWXriYJ4PktQXN-LPgDA&q=" />
            </div>
            <div style={{marginTop: '15px'}}>
              <iframe id="bing" src="https://www.bing.com/search?q=" />
            </div>
          </div>
        </div>

             
        {/* Optional JavaScript */}
        {/* jQuery first, then Popper.js, then Bootstrap JS */}
      </div>
        // <div>
        //   <div>
        //     <img className="logo-image" src={logo} alt="logo" />
        //   </div>
        //   <div className="search-bar-container">
        //     <div className="search-bar-suggestion-container">
        //       <div className="input-group">
        //         <input
        //           className="form-control"
        //           type="search"
        //           placeholder="Enter Search Query here!!"
        //           value={this.state.searchInput}
        //           onChange={this.onChangeInput}
        //         />
        //         <div className="input-group-append">
        //           <button
        //           type="button"
        //             className="btn btn-outline-secondary"
        //             onClick={this.onSearch}
        //           >
        //             Search
        //           </button>
        //         </div>
        //         {/* <DataOutput/>	 */}
        //       </div>
        //       {this.state.loadAutoCompleteList && this.state.autoCompleteResults && (	
        //         <ul className="auto-complete-list">	
        //           {this.state.autoCompleteResults.map((each) => (	
        //             <AutoCompleteItem	
        //               key={each.id}	
        //               suggestion={each.suggestion}	
        //               onLoadSuggestion={this.onLoadSuggestion}	
        //             />	
        //           ))}	
        //         </ul>	
        //       )}	
        //     </div>
        //   </div>
        // </div>
      );
    // }
  }
}