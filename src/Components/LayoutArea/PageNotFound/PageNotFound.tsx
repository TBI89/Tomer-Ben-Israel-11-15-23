import "./PageNotFound.css";
import pageNotFoundImage from "../../../Assets/Images/page-not-found.png";

function PageNotFound(): JSX.Element {
    return (
        <div className="PageNotFound">
            <img src={pageNotFoundImage} alt="PageNotFoundImage" />
        </div>
    );
}

export default PageNotFound;
