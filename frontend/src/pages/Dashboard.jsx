import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title:'', content:''});
  const navigate = useNavigate();

  useEffect(()=>{ fetchNotes(); }, []);

  const fetchNotes = async () => {
    const res = await API.get('/notes');
    setNotes(res.data);
  };

  const createNote = async (e) => {
    e.preventDefault();
    await API.post('/notes', form);
    setForm({title:'', content:''});
    fetchNotes();
  };

  const deleteNote = async (id) => {
    if(!confirm('Delete?')) return;
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Dashboard</h1>
        <button onClick={logout} className="btn">Logout</button>
      </div>

      <form onSubmit={createNote} className="mb-6">
        <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" className="input" />
        <textarea value={form.content} onChange={e=>setForm({...form, content: e.target.value})} placeholder="Content" className="input" />
        <button className="btn mt-2">Add Note</button>
      </form>

      <div>
        {notes.map(n => (
          <div key={n._id} className="border p-3 rounded mb-2">
            <div className="flex justify-between">
              <strong>{n.title}</strong>
              <div>
                <button onClick={()=>deleteNote(n._id)} className="btn-sm">Delete</button>
              </div>
            </div>
            <p className="text-sm">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
