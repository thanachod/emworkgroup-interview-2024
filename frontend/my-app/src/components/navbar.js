import { Link } from "react-router-dom";


export default function Navbar() {
    return(
        <>
            <div className="navbar-layout">
                <Link to={'/'}>Home</Link>
                <Link to={'/search'}>Search</Link>
                <Link to={'/report'}>Report</Link>
            </div>
        </>
    )
}