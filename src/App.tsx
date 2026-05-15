import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnamnesePage from './components/AnamnesePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/anamnese" element={<AnamnesePage />} />
        {/* Redirect home or 404 to anamnese with a warning if needed, 
            but for now just redirect for convenience */}
        <Route path="*" element={<Navigate to="/anamnese" replace />} />
      </Routes>
    </Router>
  );
}

