import { useState } from 'react';
import { createSuggestion } from '../../api/api';
import { SUGGESTION_CATEGORIES } from '../../utils/constants';
import Button from '../common/Button';

const SuggestionDropdown = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'general' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSuggestion(form);
      setStatus('success');
      setForm({ title: '', description: '', category: 'general' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="suggestion-dropdown">
      <h3>Submit a Suggestion</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          {SUGGESTION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <Button type="submit" variant="primary">Submit</Button>
      </form>
      {status === 'success' && <p className="text-success">Suggestion submitted!</p>}
      {status === 'error' && <p className="text-error">Something went wrong.</p>}
    </div>
  );
};

export default SuggestionDropdown;
