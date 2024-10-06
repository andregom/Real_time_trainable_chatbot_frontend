import React, { Dispatch, FormEvent, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import { QueryClient, useMutation } from 'react-query';

import './styles.css'
import Pagination from "../Pagination";

const DATABASE_URL = 'datasets/1';

export interface Item {
    tag: string,
    patterns: string[]
    responses: string[]
}

export type ItenKeys = 'tag' | 'patterns' | 'responses';

export interface IDataBase {
    problems: Array<Item>
}

interface DatabaseTableProps {
    itens: Array<Item>,
    editable: boolean
}

const DatabaseTable: React.FC<DatabaseTableProps> = (props) => {
    const isEditable = props.editable;

    const [, updateState] = useState<string>();
    const forceUpdate = React.useCallback(() => updateState(''), []);

    const receivedValues = useRef(props.itens)
    const tableBodyRef = useRef<HTMLTableSectionElement | null>(null);
    const prevItensRef = useRef<Item[] | null>(null);

    const [contentCanBeSaved, setContentCanBeSaved] = useState<boolean>(false);

    const [itens, setItens] = useState<Item[]>(props.itens);
    const [currentIndex, setCurrentIndex] = useState<number>();
    const [isIndexChosen, setIsIndexChosen] = useState<Boolean>(false);
    const [currentItem, setCurrentItem] = useState<Item>();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itensPerpage, setItensPerpage] = useState<number>(4);
    const [numberOfPages, setNumberOfPages] = useState<number>(1);
    const [currentPageItens, setCurrentPageItens] = useState<Item[]>([]);

    const [tag, setTag] = useState<string | null>('');
    const [patterns, setPatterns] = useState<string[] | null>(['']);
    const [responses, setResponses] = useState<string[] | null>(['']);

    let timeoutHandle: NodeJS.Timeout | undefined;

    useEffect(() => {
        // "timer" will be undefined again after the next re-render
        setIsIndexChosen(false);
        return () => clearTimeout(timeoutHandle);
    }, []);

    useEffect(() => {
        console.log("Index " + currentIndex);
        if (currentIndex !== undefined) setIsIndexChosen(true);
    }, [currentIndex]);

    useEffect(() => {
        console.log("Index chosen " + isIndexChosen);
        if (isIndexChosen && currentIndex !== undefined) synchronizeValues();
    }, [isIndexChosen, currentIndex]);

    useEffect(() => {
        setItens(props.itens);
    }, [props.itens]);

    useEffect(() => {
        const currentPageSectionStart = (currentPage - 1) * itensPerpage;
        const currentPageSectionEnd = currentPageSectionStart + itensPerpage;
        setCurrentPageItens(itens.slice(currentPageSectionStart, currentPageSectionEnd));
    }, [itens, currentPage]);

    useEffect(() => {
        setNumberOfPages(Math.ceil(itens.length / itensPerpage));
    }, [itens])

    const updateItem = async (e: FormEvent, updateSubItem: Function, index = 0) => {
        await updateSubItem(e, index);
    };

    const synchronizeValues = (index: number = itens.length - 1) => {
        const itemOnFocus = itens[currentIndex ?? itens.length];
        setCurrentItem(itemOnFocus);
        setContentCanBeSaved(true);
    }

    useEffect(() => {
        console.table(currentItem);
        if (currentIndex !== undefined && currentItem) {
            itens[currentIndex] = currentItem;
            setItens([...itens]);
        }
    }, [currentItem]);

    // async function debounce<T>(callback: Dispatch<SetStateAction<T | null>>, param: T) {
    //     return setTimeout(async () => {
    //         if (param)
    //             await callback(param);
    //     }, 1500);
    // }

    async function updateTag(e: React.FocusEvent, index = 0) {
        e.preventDefault();
        if (currentItem !== undefined) {
            const newTag = (e.target as HTMLElement).innerText ?? '';
            // (e.target as HTMLElement).textContent = newTag;
            currentItem['tag'] = newTag.trim();
            setCurrentItem(currentItem);
        }
    }

    async function updatePatterns(e: React.FocusEvent, patternIndex: number) {
        e.preventDefault();

        clearTimeout(timeoutHandle);
        if (currentItem !== undefined) {
            const patternsToBeAdded = (e.target as HTMLElement).innerText ?? '';//.split('\n').filter(Boolean);
            // (e.target as HTMLElement).textContent = patternsToBeAdded;
            currentItem['patterns'][patternIndex] = patternsToBeAdded.trim();
            setCurrentItem(currentItem);
        }
    }

    async function updateResponses(e: React.FocusEvent, responseIndex: number) {
        e.preventDefault();

        clearTimeout(timeoutHandle);
        if (currentItem !== undefined) {
            const responsesToBeAdded = (e.target as HTMLElement).innerText ?? '';//.split('\n').filter(Boolean);
            // (e.target as HTMLElement).innerText = responsesToBeAdded;
            currentItem['responses'][responseIndex] = responsesToBeAdded.trim();
            setCurrentItem(currentItem);
        }
        // timeoutHandle = await debounce<string[]>(setResponses, responsesToBeAdded ?? ['']);
        // setResponses((e.target as HTMLElement).innerText.split('\n') ?? ['']);
    }

    const restore = () => {
        setItens(props.itens ?? itens);
        setContentCanBeSaved(false);
    }

    const updateDatabaseRequest = async (Database: IDataBase) => {
        const { data: response } = await axios.put(DATABASE_URL,
            JSON.stringify(Database),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: false
            }
        );
        return response;
    };

    const sendChangesOnDatabase = useMutation(updateDatabaseRequest, {
        onSuccess: () => {
            alert("Changes saved Successfully!");
        },
        onError: () => {
            alert("Server Probably Down or an Error Occured!");
        },
        onSettled: () => {
            (new QueryClient()).invalidateQueries('create');
        }
    });

    const handleUpdateDatabase = async (e: FormEvent) => {
        e.preventDefault();
        sendChangesOnDatabase.mutateAsync({ problems: itens });
    }

    const clearVariables = () => {
        setTag('');
        setPatterns(['']);
        setResponses(['']);
    }

    const addNewEmptyLine = (index: number) => {
        const newItem = {
            tag: '',
            patterns: [''],
            responses: ['']
        };
        itens.splice(index, 0, newItem);
        setItens([...itens]);
    }

    const addNewLine = (index = itens.length + 1, downOrAbove = 0) => {
        clearVariables();
        addNewEmptyLine(index + downOrAbove);
    }

    const deleteItem = (index = itens.length - 1) => {
        const lastIndex = itens.length
        // Slice retorna os itens removidos enquanto splice é inplace
        itens.splice(index, 1)
        setItens([...itens]);
        setContentCanBeSaved(true);
    }

    const formatDisplay = (content: string): string => {
        return content ? `<q>${content}</q>` : ``;
    }

    const siwtchPage = (page: number) => {
        setCurrentPage(page);
    }

    const getRealIndex = (indexOfCurrentPageIten: number) => {
        const pageIndex = (currentPage - 1) * itensPerpage;
        console.log(pageIndex);
        return pageIndex + indexOfCurrentPageIten;
    }

    const handleKeyDown = async (e: React.KeyboardEvent, rowKey: ItenKeys, index: number) => {
        if ((e.target as HTMLElement).innerText.trim() && e.key === 'Enter') {
            e.preventDefault();
            const currentArray = itens[currentIndex ?? itens.length][rowKey];
            (currentArray as string[]).splice(index + 1, 0, '');
            setItens([...itens]);
            setTimeout(() => ((e.target as HTMLElement).nextElementSibling as HTMLElement).focus(), 5);
        }
        if (!(e.target as HTMLElement).innerText.trim() && e.key === 'Backspace') {
            (e.target as HTMLElement).previousElementSibling != null && ((e.target as HTMLElement).previousElementSibling as HTMLElement).focus();
            const currentArray = itens[currentIndex ?? itens.length][rowKey];
            if (!(e.target as HTMLElement).innerText && currentArray.length > 1) {
            e.preventDefault();
            if (currentArray.length > 1) {
                (currentArray as string[]).splice(index, 1);
            } else {
                itens.splice(currentIndex ?? itens.length, 1);
            }
                setItens([...itens]);
            }
            setItens([...itens]);
        }
    }

    return (
        <div className="page-container">
            <table onBlur={
                e => {
                    setCurrentIndex(undefined);
                    setIsIndexChosen(false);
                }
            }>
                <thead>
                    <tr>
                        <th scope="col">Tag</th>
                        <th scope="col">Patterns</th>
                        <th scope="col">Responses</th>
                        {isEditable ? (<th className="actions-col">actions</th>) : (<></>)}
                    </tr>
                </thead>
                <tbody ref={tableBodyRef}>
                    {currentPageItens.map((item, itemIndex) => (
                        <tr
                            key={itemIndex}
                            onFocus={e => setCurrentIndex(getRealIndex(itemIndex))}
                        >
                            <td
                                className="intetion-cell"
                            >
                                <div className="cell-label">Tag:</div>
                                <span
                                    className="intention-holder holder"
                                    // placeholder="Intenção"
                                    spellCheck={false}
                                    contentEditable={isEditable}
                                    suppressContentEditableWarning={true}
                                    // onInput={updateTag}
                                    onBlur={e => { updateItem(e, updateTag) }}
                                    dangerouslySetInnerHTML={{ __html: `${formatDisplay(item.tag)}` }}
                                >
                                    {/* {item.tag ? (<q>{item.tag}</q>) : <></>} */}
                                </span>
                            </td>
                            <td
                                className="patterns-cell"
                            >
                                <div className="cell-label">Patterns:</div>
                                <div
                                    className="holder-parent"
                                    spellCheck={false}
                                // contentEditable={isEditable}
                                >
                                    {item.patterns.map((pattern, patternIndex) => (
                                        <span
                                            key={patternIndex}
                                            contentEditable={isEditable}
                                            suppressContentEditableWarning={true}
                                            className="holder"
                                            // placeholder="Exemplos"
                                            onKeyDown={(e) => { handleKeyDown(e, 'patterns', patternIndex) }}
                                            // onChange={updatePatterns}
                                            onBlur={e => { updateItem(e, updatePatterns, patternIndex) }}
                                            dangerouslySetInnerHTML={{ __html: `${formatDisplay(pattern)}` }}
                                        >
                                            {/* {pattern ? (<q>{pattern}</q>) : <></>} */}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td
                                className="responses-cell"
                            >
                                <div className="cell-label">Responses:</div>
                                <span
                                    className="holder-parent"
                                    // contentEditable={isEditable}
                                    spellCheck={false}
                                >
                                    {item.responses.map((response, responseIndex) => (
                                        <span
                                            key={responseIndex}
                                            className="holder"
                                            // placeholder="Respostas"
                                            contentEditable={isEditable}
                                            suppressContentEditableWarning={true}
                                            onKeyDown={(e) => { handleKeyDown(e, 'responses', responseIndex) }}
                                            // onChange={updateResponses}
                                            onBlur={e => { updateItem(e, updateResponses, responseIndex) }}
                                            dangerouslySetInnerHTML={{ __html: `${formatDisplay(response)}` }}
                                        >
                                            {/* {response ? (<q>{response}</q>) : <></>} */}
                                        </span>
                                    ))}
                                </span>
                            </td>
                            {isEditable ?
                                (<td>
                                    <div className="side-buttons-container">
                                        <span className="edit-buttons">
                                            <button
                                                className="buttons add-new-line-button"
                                                onClick={e => { addNewLine(getRealIndex(itemIndex), 0) }}
                                            >
                                                △
                                            </button>
                                            <button
                                                className="buttons delete-line-button"
                                                onClick={e => { deleteItem(getRealIndex(itemIndex)) }}
                                            >
                                                −
                                            </button>
                                            <button
                                                className="buttons save-changes-button"
                                                onClick={handleUpdateDatabase}
                                                disabled={!contentCanBeSaved}
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="buttons add-new-line-button"
                                                onClick={e => { addNewLine(getRealIndex(itemIndex), 1) }}
                                            >
                                                ▽
                                            </button>
                                            {/* <button
                                            className="buttons restore-button"
                                            onClick={restore}
                                        >
                                            ⟲
                                        </button> */}
                                        </span>
                                    </div>
                                </td>) : (<></>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            {isEditable ?
                (<div className="buttons-container">
                    <span className="edit-buttons">
                        <button
                            className="buttons add-new-line-button"
                            onClick={e => { addNewLine(currentPage * itensPerpage) }}
                        >
                            + Add New Line
                        </button>
                        <button
                            className="buttons delete-line-button"
                            onClick={e => { deleteItem(((currentPage - 1) * itensPerpage) + currentPageItens.length - 1) }}
                        >
                            - Delete Line
                        </button>
                        <button
                            className="buttons restore-button"
                            onClick={restore}
                        >
                            ⟲ Restore
                        </button>
                    </span>
                    <button
                        className="buttons save-changes-button"
                        onClick={handleUpdateDatabase}
                        disabled={!contentCanBeSaved}
                    >
                        Save Changes
                    </button>
                </div>)
                :
                (<div className="disabled-edit-warning">
                    Only an administrator can edit this content!
                </div>)

            }
            <Pagination
                numberOfPages={numberOfPages}
                currentPage={currentPage}
                setCurrentPage={siwtchPage}
            />
        </div>
    );
}

export default DatabaseTable;