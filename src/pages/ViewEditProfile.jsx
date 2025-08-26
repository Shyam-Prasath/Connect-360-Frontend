import { useEffect, useState } from 'react';
import api from '../api';

function ViewEditProfile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setUser(res.data);
            setForm(res.data);
        } catch (err) {
            console.error(err);
        }
        };
        fetchUser();
    }, []);

    const handleChange = (e, key) => {
        setForm(prev => ({
        ...prev,
        [key]: e.target.value,
        }));
    };

    const saveProfile = async () => {
        try {
        const token = localStorage.getItem('token');
        await api.put('/auth/update-profile', form, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setUser(form);
        setEditing(false);
        } catch (err) {
        console.error(err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>My Profile</h2>
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '1rem' }}>
            {Object.entries(user).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
                <strong>{key}:</strong>{' '}
                {editing ? (
                <input
                    type="text"
                    value={form[key] || ''}
                    onChange={(e) => handleChange(e, key)}
                />
                ) : (
                value
                )}
            </div>
            ))}
        </div>
        {!editing ? (
            <button onClick={() => setEditing(true)} style={{ marginTop: '1rem' }}>
            Edit
            </button>
        ) : (
            <button onClick={saveProfile} style={{ marginTop: '1rem' }}>
            Save
            </button>
        )}
        </div>
    );
}

export default ViewEditProfile;