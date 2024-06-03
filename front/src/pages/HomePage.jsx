import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => (
    <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Law Enforcement Agency Portal</h1>
        <div className="flex justify-center space-x-4">
            <Link to="/admin">
                <Button variant="primary">Admin Page</Button>
            </Link>
            <Link to="/create-audition">
                <Button variant="secondary">Create a New Audition</Button>
            </Link>
            <Link to="/open-audition">
                <Button variant="accent">Open an Audition</Button>
            </Link>
        </div>
    </div>
);

export default HomePage