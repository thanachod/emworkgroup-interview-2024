import { useState } from "react";
import Navbar from "../components/navbar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const title = [ 'นาย', 'นาง', 'นางสาว'];
    const [imagePath, setImagePath] = useState();
    const [file, setFile] = useState();
    const [data, setData] = useState({});
    // const formData = new FormData();
    


    async function handleSubmit(e) {
        e.preventDefault();
        console.log(data);
        var formData = await new FormData();
        await formData.append('file', file);
        await formData.append('user_data', JSON.stringify(data));
        console.log(formData);
        await axios.post(`http://localhost:4000/user`, formData);
        return navigate('/search');
    }

    function handleChange(e) {
        const newData = {...data};
        if (e.target.files) {
            newData[e.target.id] = e.target.files[0].name
            setFile(e.target.files[0])
            setImagePath(URL.createObjectURL(e.target.files[0]))
            setData(newData)
        } else {
            newData[e.target.id] = e.target.value
            setData(newData)
        }
    }

    return(
        <>
            <Navbar />
            <div>
                Home
            </div>
            <div  className="default-layout">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label>คำหน้าชื่อ:</label>
                    <select id="name_title"
                    onChange={handleChange}
                    >
                        <option selected>คำนำหน้าชื่อ</option>
                        {title.map((item) => (
                            <option value={item}>{item} </option>
                        ))}
                    </select>
                    <label>ชื่อ: </label>
                    <input type="text" id="surename" onChange={handleChange}/>
                    <label>นามสกุล: </label>
                    <input type="text" id="lastname" onChange={handleChange}/>
                    <label>วัน/เดือน/ปีเกิด: </label>
                    <input type="date" id="birth_date" 
                    
                    onChange={handleChange}/>
                    <label>รูปภาพโปรไฟล์: </label>
                    {!imagePath ? '' : <img src={imagePath} width={125} height={125} />}
                    <input type="file" id="profile_pic" onChange={handleChange}/>
                    <button type="submit">Create</button>
                </form>
            </div>
        </>
    )
}