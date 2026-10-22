import { NavLink } from 'react-router-dom';
import MaterialList from './MaterialList.tsx';

function MaterialNav() {
  return (
    <nav>
      <NavLink to="/materials/new" end>
        New material
      </NavLink>
    </nav>
  );
}

function MaterialsPage() {
  return (
    <>
      <MaterialNav />
      <br />
      <MaterialList />
    </>
  );
}

export default MaterialsPage;
