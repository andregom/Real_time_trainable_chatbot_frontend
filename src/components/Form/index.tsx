import React, { useEffect, useState } from "react";
import fetchFakeMessages from '../../utils/fetchFakeMessages';

import './styles.scss';

import axios from "../../api/axios";
import { BASE_URL, queryClient } from '../../service/queryClient';

const POST_DATASET_URL = 'datasets/1'

interface IssueFormProps {

}

interface IDatasetProps {
    title: string;
    enterpriseName?: string;
    activityField?: string;
    description?: string;
}

interface IDataset {
    props: IDatasetProps
    file: File | null;
}

const postDataset = async (dataset: IDataset) => {
    const formData = new FormData();
    formData.append('file', dataset.file ? dataset.file : '');
    formData.append('jsonData', JSON.stringify(dataset.props));


    await axios.post(
        `${BASE_URL}/${POST_DATASET_URL}`,
        formData,
        {
            headers: {
                'Authorization': 'YOUR_API_AUTHORIZATION_TOKEN',
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            params: {
                'id': 1
            }
        }
    )
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
}

const IssueForm: React.FC<IssueFormProps> = () => {

    const [datasetProps, setDatasetProps] = useState<IDatasetProps>({ title: '' });

    const [dataset, setDataset] = useState<IDataset>({
        props: datasetProps,
        file: null
    });

    useEffect(() => {
        setDataset({ ...dataset, props: datasetProps })
    }, [datasetProps]);

    const handleInputChange = (propTitle: string, e: React.FormEvent) => {
        setDataset({ ...dataset, [propTitle]: e.target })
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        //e.preventDefault();

        postDataset(dataset);

        console.log(dataset);
        window.alert(`Sua nova base de dados ${dataset.props.title} foi cadastrada com sucesso!`)
    }

    return (
        <div>
            <form
                className='dataset-form'
                onSubmit={handleSubmit}
            >
                <div className='form-container'>

                    Título da nova base de dados de treinamento que deseja cadastrar?*
                    <input
                        title='title'
                        className='dataset-form-input-field'
                        id='dataset-form-input-field'
                        placeholder='Preencha aqui a informação descrita acima'
                        required={true}
                        onChange={e => { setDatasetProps({ ...datasetProps, title: e.target.value }) }}
                    >
                    </input>

                    Qual o nome da sua empresa?
                    <input
                        title='enterpriseName'
                        className='dataset-form-input-field'
                        id='dataset-form-input-field'
                        placeholder='Preencha aqui a informação descrita acima (Opcional)'
                        required={false}
                        onChange={e => { setDatasetProps({ ...datasetProps, enterpriseName: e.target.value }) }}
                    >
                    </input>

                    Em qual ramo que sua empresa atua?
                    <input
                        title='activityField'
                        className='dataset-form-input-field'
                        id='dataset-form-input-field'
                        placeholder='Preencha aqui a informação descrita acima (Opcional)'
                        required={false}
                        onChange={e => { setDatasetProps({ ...datasetProps, activityField: e.target.value }) }}
                    >
                    </input>

                    Insira uma descrição para sua base de dados:
                    <input
                        title='description'
                        className='dataset-form-input-field'
                        id='dataset-form-input-field'
                        placeholder='Preencha aqui a informação descrita acima (Opcional)'
                        required={false}
                        onChange={e => { setDatasetProps({ ...datasetProps, description: e.target.value }) }}
                    >
                    </input>

                    Selecione o arquivo JSON com a nova base de dados para treinamento:*
                    <input
                        className='dataset-form-file-input-field'
                        id='dataset-form-file-input-field'
                        placeholder='Preencha aqui a informação descrita acima'
                        required={true}
                        type='file'
                        accept=".json"
                        onChange={e => { setDataset({ ...dataset, file: e.target.files ? e.target.files[0] : null }) }}
                    >
                    </input>
                    <button>
                        submit
                    </button>
                </div>
            </form >
        </div >
    )
}

export default IssueForm;