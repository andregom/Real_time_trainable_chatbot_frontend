import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import DatabaseHandler, {IDataBase} from '../../components/DatabaseHandler';

const DATABASE_URL = 'datasets/1';

interface DatabasePageProps {
    editPermission: boolean
}

const DatabasePage: React.FC<DatabasePageProps> = (props) => {

    const { data, isFetching } = useQuery<IDataBase>(DATABASE_URL, { refetchOnWindowFocus: true });
    const [database, setDatabase] = useState<IDataBase>({ problems: [] });

    useEffect(() => {
        setDatabase(data ?? { problems: [] });
    }, [data]);

    return (
        <DatabaseHandler
            itens={data?.problems ? data.problems : []}
            editable={props.editPermission}
        />
    );
}

export default DatabasePage;