import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch} from 'react-redux';


const Home = () => {
    
    const agentData = useSelector(state => state.agent)
    console.log(agentData)
    const dispatch = useDispatch()
    const affaireData = agentData.affaires.find((affaire) => affaire.id == agentData.currentAffaire)



    return(
    <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold text-center mb-8">  قضية  {affaireData.type} : {affaireData.description}</h1>
        <div className="flex justify-center space-x-4">
            <Link to="/affaires">
                <Button variant="primary">العودة إلى القضايا</Button>
            </Link>
            <Link to="/create-audition">
                <Button variant="secondary">بدء جلسة جديدة</Button>
            </Link>
            <Link to="/auditions">
                <Button variant="accent">رؤية الجلسات السابقة</Button>
            </Link>
            <Link to="/add-agents">
                <Button variant="accent">اضافة ضباط اخرين الى القضية</Button>
            </Link>
        </div>
    </div>)
    
}

export default Home