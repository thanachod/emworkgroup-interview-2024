import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, BarChart, Rectangle, XAxis, YAxis } from 'recharts';

export default function Report() {

    const [data, setData] = useState([]);
    const [report, setReport] = useState([]);
    var idx = 1;

    useEffect(() => {
        const fetch_data = async () => {
            await axios.get(`http://localhost:4000/users`)
                .then((res) => {
                    setData(res.data)
                    setReport([]);
                })
                
                
        }
        fetch_data();
        
        
        
    }, [])

    useEffect(() => {
        const init_data = async (input_data) => {
            var idx = 0;
            var age_list = [];
            var age_report = {};
            // console.log(input_data);

            try {
                if(input_data.length > 0){
                    do {
                        input_data[idx].age = now_age(input_data[idx].birth_date)
                        input_data.forEach((item) => {
                            
                            if (!age_list.includes(input_data[idx].age)) {
                                // setData((prevData) => [...prevData, {name: input_data, amount: 1}])
                                age_list.push(input_data[idx].age)
                            } 
                        })
                        if (age_list.includes(input_data[idx].age)) {
                            if (age_report[input_data[idx].age] >= 1) {
                                age_report[input_data[idx].age] += 1;
                            } else {
                                age_report[input_data[idx].age] = 1;
                            }
                            
                        }
                        idx++;
                    } while ( idx < input_data.length)
                    
                    
                }
                return age_report

            } catch (err) {
                console.log(err);
                return null
            }
            
        }
        const store_data = async (input_data) => {
            var input_keys = Object.keys(input_data);
            input_keys.forEach((item) => {
                setReport((prevData) => [...prevData, {name: item, amount: input_data[item]}])  
            })  
        }
        async function func_call() {
            var age_report = await init_data(data);
            await store_data(age_report);
        }
        const age_now = async () => {
            let i = 0;
            if (data[i]) {              
                do {
                    data[i].age = await now_age(data[i].birth_date)
                    changeValue(now_age(data[i].birth_date))
                    i++;
                } while (i < data.length);
            }
        }
        const changeValue = (input_age) => {
            var i = 0;
            var name_list = []
            
            do {
                try {
                    if (report[i].name === input_age[i].age){
                        if (!report[i].age){
                            report[i].age = 0
                        } else {
                            report[i].amount += 1
                        }
                    } 
                } catch (err) {
                    // if there is no name in list
                    console.log(err);
                    
                    setReport((prevData) => [...prevData, {name: input_age[i], value: 1}])
                }
               
                i++;
            } while (i < data.length)
            
        }
        func_call();
    }, [data])

    function now_age(date) {
        const birthDate = new Date(date);
        const today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age
    }

    

    return(
        <>
            <Navbar />
            <div>
                Report
            </div>
            <div className="default-layout">
                <div>กราฟแสดงสมาชิกตามอายุ</div>
                {!data ? 'loading...' : (
                    <BarChart
                        width={500}
                        height={300}
                        data={report}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        
                    >
                        <XAxis dataKey={"name"} />
                        <YAxis />
                        <Bar dataKey="amount" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    </BarChart>
                )}
                <div>
                
                <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Age</th>
                        <th>Amount</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {!report ? '' : 
                        report.map((item) => (
                            <tr key={item.name}>
                                <td>{idx++}</td>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                                
                            </tr>
                        ))
}
                </tbody>
                </table>
            </div>
            </div>
        </>
    )
}