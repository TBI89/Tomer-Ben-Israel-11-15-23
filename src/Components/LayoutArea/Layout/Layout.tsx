import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <div className="Layout">
            
            <header>
                <Menu />
            </header>

            <main>
                <Routing />
            </main>

        </div>
    );
}

export default Layout;
