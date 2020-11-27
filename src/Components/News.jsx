import React, { Component } from "react";
import news from "../Helper/News";
import { BiLinkAlt } from "react-icons/bi";
class News extends Component {
  state = {
    news: [],
    isLoaded: false,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let temp = [];

    //Comment this-------------
    // news.forEach((element) => {
    //   temp.push({
    //     title: element["title"],
    //     datePublished: element["datePublished"],
    //     url: element["url"],
    //     provider: element["provider"]["name"],
    //   });
    // });
    // this.setState({ news: temp });
    // this.setState({ isLoaded: true });
    //Uncomment this-------
    fetch(
      "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?pageSize=10&q=forex&autoCorrect=true&pageNumber=1&toPublishedDate=null&fromPublishedDate=null",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "5812113f4bmshfa9aaa56fd6325cp1518c7jsn2e3209951355",
          "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        res["value"].forEach((element) => {
          temp.push({
            title: element["title"],
            datePublished: element["datePublished"],
            url: element["url"],
            provider: element["provider"]["name"],
          });
        });
      })
      .then(() => {
        this.setState({ news: temp });
        this.setState({ isLoaded: true });
      });
  }

  render() {
    return (
      <div>
        <div className="historical-header">Forex News</div>
        <div className="example3 mt-1">
          <div className="news-scroll">
            {" "}
            {this.state.news.map((e, i) => (
              <>
                <div key={i} className="news-item">
                  <div className="news-header">
                    <a href={e["url"]}>{e["title"]}</a>
                  </div>
                  <small className="news-info">
                    {new Date(e["datePublished"]).toUTCString() + " | "}{" "}
                    <b>{e["provider"]}</b>
                  </small>
                </div>
                <BiLinkAlt id="link" style={{ float: "right" }} />
              </>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default News;
