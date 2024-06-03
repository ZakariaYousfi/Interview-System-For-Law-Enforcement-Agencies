// in src/posts.tsx
import { List, Datagrid, TextField, ReferenceField } from "react-admin";

export const PersonList = () => (
    <List>
        <Datagrid rowClick="edit">
            <ReferenceField source="userId" reference="people" />
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="birthDate" />
        </Datagrid>
    </List>
);