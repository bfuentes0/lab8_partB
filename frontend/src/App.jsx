import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', birthdate: '', salary: ''
  });

  const load = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  useEffect(() => { load(); }, []);
  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...form,
      salary: form.salary === '' ? null : Number(form.salary)
    };
    
    if (isEditing) {
    await api.put(`employees/${editId}`, body);
  } else {
    await api.post('employees', body);
    }
    
    setForm({ first_name: '', last_name: '', email: '', birthdate: '', salary: '' });
    setIsEditing(false);
    setEditId(null);
    await load();
};

  const handleEdit = async (id) => {
  const res = await api.get(`employees/${id}`);
  const row = res.data;

  setForm({
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    birthdate: row.birthdate?.slice(0, 10) || '',
    salary: row.salary ?? ''
  });

  setIsEditing(true);
  setEditId(id);
};

  const handleDelete = async (id) => {
    await api.delete(`employees/${id}`);
    await load();
  };

  return (
    <div className="card" style={{ margin: 20 }}>
      <h1>Employees</h1>

      <table>
        <thead><tr><th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Birthdate</th><th>Salary</th><th>Actions</th></tr></thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              <td>{emp.first_name || '-'}</td>
              <td>{emp.last_name || '-'}</td>
              <td>{emp.email || '-'}</td>
              <td>{emp.birthdate ? new Date(emp.birthdate).toLocaleDateString() : '-'}</td>
              <td>{emp.salary != null ? Number(emp.salary).toFixed(2) : '-'}</td>

              <td>
                <button onClick={() => handleEdit(emp.employee_id)}>Edit</button>
                <button onClick={() => handleDelete(emp.employee_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr></hr>

      <h2>{isEditing ? "Update Employee" : "Add New Employee"}</h2> 

      <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
        <input name="first_name" value={form.first_name} onChange={onChange} placeholder="First name" />
        <input name="last_name" value={form.last_name} onChange={onChange} placeholder="Last name" />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
        <input name="birthdate" type="date" value={form.birthdate} onChange={onChange} />
        <input name="salary" type="number" step="0.01" value={form.salary} onChange={onChange} placeholder="Salary" />
        
        <button type="submit"> {isEditing ? "Update Employee" : "Add Employee"} </button>

        
      </form>
    </div>
  );
}