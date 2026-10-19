import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import MaterialsPage from './features/materials/MaterialsPage.tsx'
import MaterialForm from './features/materials/MaterialForm.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      {/*<Route path="about" element={<About />} />*/}

      <Route path="materials">
        <Route index element={<MaterialsPage />} />
        <Route path="new" element={<MaterialForm />} />
        <Route path="edit/:id" element={<MaterialForm />} />
      </Route>
    </Routes>

  </BrowserRouter>,
)
