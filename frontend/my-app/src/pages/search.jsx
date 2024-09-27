import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import { Link } from "react-router-dom";


export default function Search() {

    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    var idx = 1;

    useEffect(() => {

        fetch_data();
    }, [])

    function fetch_data() {
        axios.get(`http://localhost:4000/users`)
            .then(async (res) => {
                var idx = 0
                do {
                    res.data[idx].age = await now_age(res.data[idx].birth_date)
                    idx++;
                } while (idx < res.data.length)
                return res.data
            }).then((elem) => {
                return elem.sort(dynamicSort("age"))
            }).then((item) => {
                setData(item);
                setSearchResult(item);
            });
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    function filterArray(input_array, input_text) {
        var filtered_surename = input_array.filter(item => {
            return item.surename.toLowerCase().indexOf(input_text.toLowerCase()) !== -1 || item.lastname.toLowerCase().indexOf(input_text.toLowerCase()) !== -1;
        });
        console.log(filtered_surename);

        return filtered_surename
    }

    function now_age(date) {
        const birthDate = new Date(date);
        const today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age
    }

    function handleSearch(e) {
        e.preventDefault();
        var input_text = e.target.search.value;
        var keys = ["surename", "lastname"];
        setSearchResult(filterArray(data, input_text))
    }

    async function handleDelete(input_id) {
        console.log(input_id);
        await axios.delete(`http://localhost:4000/user/${input_id}`);
        fetch_data();
    }

    return (
        <>
            <Navbar />
            <div>
                Search
            </div>
            <div className="default-layout">
                <form onSubmit={handleSearch}>
                    <input type="text" name="search" />
                    <button type="submit">Search</button>
                </form>
            </div>
            <div className="default-layout">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Members</th>
                            <th>Age</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!searchResult ? 'loading...' : searchResult.map((item) => (
                            <tr key={item.id}>
                                <td>{idx++}</td>
                                <td>{item.name_title}{item.surename} {item.lastname}</td>
                                <td>{now_age(item.birth_date)}</td>
                                <td><Link to={`/edit/${item.id}`}>
                                    Edit
                                </Link></td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}