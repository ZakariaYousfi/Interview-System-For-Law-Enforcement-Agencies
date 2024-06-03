// in src/App.tsx
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { PersonList } from "./people";

export const AdminInterface = () => (
    <Admin basename="/admin" dataProvider={simpleRestProvider(import.meta.env.VITE_JSON_SERVER_URL)}>
        <Resource name="people" list={PersonList} />
    </Admin>
);