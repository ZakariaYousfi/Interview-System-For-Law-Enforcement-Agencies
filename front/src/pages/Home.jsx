import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => (
    <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center mb-8">بوابة وكالة إنفاذ القانون</h1>
        <div className="flex justify-center space-x-4">
            <Link to="/admin">
                <Button variant="primary">العودة إلى القضايا</Button>
            </Link>
            <Link to="/create-audition">
                <Button variant="secondary">بدء مقابلة جديدة</Button>
            </Link>
            <Link to="/open-audition">
                <Button variant="accent">رؤية المقابلات السابقة</Button>
            </Link>
        </div>
    </div>
);

export default Home