import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditUser() {
    const title = [ 'นาย', 'นาง', 'นางสาว'];
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [file, setFile] = useState();
    const [Image, setImage] = useState();
    const { id } = useParams();


    useEffect(() => {
        axios.get(`http://localhost:4000/user/${id}`)
            .then((res) => {
                setData(res.data[0])
                console.log(res.data);
                console.log(res.data[0].profile_pic);
                // setImage(`http://localhost:4000/public/images/${res.data[0].profile_pic}`)
                // console.log(`http://localhost:4000/public/images/${res.data[0].profile_pic}`);

            })
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData()
        formData.append('file', file)
        formData.append('user_data', JSON.stringify(data))
        axios.put(`http://localhost:4000/user/${id}`, formData)
        console.log(formData);
        console.log(data);
        return navigate('/search')
    }

    function handleOnChange(e) {
        const newData = { ...data }

        if (e.target.files) {
            newData[e.target.id] = e.target.files[0].name
            setFile(e.target.files[0]) // or use for display img URL.createObjectURL() 
            setImage(URL.createObjectURL(e.target.files[0]))
            setData(newData)


        } else {
            newData[e.target.id] = e.target.value
            setData(newData)
        }
    }

    function birth_date_to_string(date) {

        if (date) {
            return date.slice(0, 10)
        }
        return
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

    function datetime_format(date) {
        const formattedDatetime = new Date(date).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return formattedDatetime
    }

    return (
        <>
            <Navbar />
            <div>Edit</div>
            <div className="default-layout">
                {!data ? 'loading...' : (
                    <form onSubmit={handleSubmit} method="post">


                        <label>คำนำหน้าชื่อ :</label>
                        
                        <select id="name_title"
                            onChange={handleOnChange}
                        >

                            {title.map((item) => {
                                if (data.name_title === item)
                                    return <option selected value={item}>{item}</option>
                                return <option value={item}>{item} </option>
                            })}
                        </select>
                        <label>ชื่อ :</label>
                        <input type="text" id="surename" onChange={handleOnChange}
                            value={data.surename} />
                        <label>นามสกุล :</label>
                        <input type="text" id="lastname" onChange={handleOnChange}
                            value={data.lastname} />
                        <label>วันเดือนปีเกิด :</label>
                        <input type="date" id="birth_date" onChange={handleOnChange}
                            value={birth_date_to_string(data.birth_date)} />
                        <label>อายุ :</label>
                        <input type="text" id="year-old" onChange={handleOnChange}
                            value={now_age(data.birth_date)} />
                        <label>รูปภาพโปรไฟล์ :</label>
                        {!Image ? '' : <img src={Image} width={125} height={125} />}
                        <input type="file" id="profile_pic" onChange={handleOnChange} />
                        <label>วันเวลาที่ปรับปรุงข้อมูลล่าสุด :</label>
                        <input type="text" id="updated-at"
                            value={datetime_format(data.updated_at)} />
                        <button type="submit">Submit</button>







                    </form>
                )}


            </div>
        </>
    )
}