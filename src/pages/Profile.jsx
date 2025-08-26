import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Profile() {
    const [name, setName] = useState("");
    const [role, setRole] = useState("student");
    const [universityName, setUniversityName] = useState("");
    const [year, setYear] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [position, setPosition] = useState("");  // new state
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api
        .get("/profile")
        .then((res) => {
            if (res.data.profileComplete) navigate("/home");
            else {
            setName(res.data.name || "");
            setRole(res.data.role || "student");
            setUniversityName(res.data.universityName || "");
            setYear(res.data.year || "");
            setCompanyName(res.data.companyName || "");
            setPosition(res.data.position || "");               // load saved position
            setYearsOfExperience(res.data.yearsOfExperience || "");
            }
        })
        .catch(() => {});
    }, [navigate]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/profile", {
            name,
            role,
            universityName,
            year,
            companyName,
            position,
            yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
            });

            
            if (res.data.email) {
            localStorage.setItem("email", res.data.email);
            }

            navigate("/home");
        } catch (err) {
            setMsg(err.response?.data?.msg || "Failed to update profile");
        }
        };


    return (
        <div>
        <h2>Complete Your Profile</h2>
        <form onSubmit={submit}>
            <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="jobbusiness">Job/Business</option>
            </select>

            {role === "student" ? (
            <>
                <input
                placeholder="University Name"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                required
                />
                <input
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                />
            </>
            ) : (
            <>
                <input
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                />
                <input
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                />
                <input
                type="number"
                placeholder="Years of Experience"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                required
                />
            </>
            )}

            <button type="submit">Save Profile</button>
        </form>
        <p>{msg}</p>
        </div>
    );
}

export default Profile;
