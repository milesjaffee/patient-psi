'use client'

import * as React from 'react'
import { useEffect, useState } from 'react';

import { CheckboxReactHookFormMultiple } from './diagram-checkbox'
import { diagramRelated, diagramCCD, diagramDescriptionMapping, diagramTitleMapping } from '@/app/api/data/diagram-fields'
import { sessionInstructions } from '@/app/api/data/session-instruction'
import { CCDResult, CCDTruth } from '@/lib/types'
import { getCCDResult, getCCDTruth, saveCCDResult, saveCCDTruth } from '@/app/actions'
import { PatientProfile, initialProfile } from '@/app/api/data/patient-profiles'

import { getChatSummary, setChatSummary, getChatAnalysis, setChatAnalysis } from '@/app/api/getDataFromKV';

import { useUIState, useActions } from 'ai/rsc';
import { type AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid';
import { SystemMessage } from './message';

import { createRoot } from 'react-dom/client';
import { FeedbackScreen } from './feedback-screen';

// Before
async function fetchPatientProfile(
    setPatientProfile: (patientProfile: PatientProfile) => void) {
    try {
        fetch('/api/profile')
            .then(response => response.json()
                .then(data => {
                    setPatientProfile(data.profile);
                })
            ).catch(error => {
                console.log(error);
            });
    } catch (error) {
        console.log("error fetching patient profile");
    }
}


async function fetchPatientType(
    userId: string,
    chatId: string,
    setPatientType: (patientType: string) => void) {
    try {
        fetch(`/api/type?userId=${userId}&chatId=${chatId}`)
            .then(response => response.json()
                .then(data => { setPatientType(data.type) })
            ).catch(error => {
                console.log(error);
            });
    } catch (error) {
        console.log("error fetching patient type");
    }

}


interface DiagramListProps {
    userId: string
    chatId: string
    patientProfile: PatientProfile
}

export type InputValues = {
    [key: string]: string | { id: string; label: string }[];
    checkedHelpless: { id: string; label: string }[];
    checkedUnlovable: { id: string; label: string }[];
    checkedWorthless: { id: string; label: string }[];
    checkedEmotion: { id: string; label: string }[];
};

export function DiagramList({ userId, chatId }: DiagramListProps) {
    const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(initialProfile);
    const [isFetchedPatientProfile, setIsFetchedPatientProfile] = useState(false);
    const [savedCCDTruth, setSavedCCDTruth] = useState<CCDTruth | null>(null);
    const [savedCCDResult, setSavedCCDResult] = useState<CCDResult | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [patientType, setPatientType] = useState('');
    const [summary, setSummary] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [showSummary, setShowSummary] = useState(false);

        // Modal state and creator that controls a React-rendered modal instead of manipulating the DOM directly
    const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [analysisModalContent, setAnalysisModalContent] = useState<string>('Analyzing conversation... please wait.');
    // New: allow storing a React node to render inside the modal
    const [analysisModalNode, setAnalysisModalNode] = useState<React.ReactNode | null>(null);


    const initialInputValues: InputValues = {
        ...Object.fromEntries([...diagramRelated, ...diagramCCD].map(name => [name, ''])),
        checkedHelpless: [],
        checkedUnlovable: [],
        checkedWorthless: [],
        checkedEmotion: [],
    };

    const [inputValues, setInputValues] = useState<InputValues>(initialInputValues);
    const [isLoading, setIsLoading] = useState(true);

    const [messages, setMessages] = useUIState<typeof AI>()

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isFetchedPatientProfile) {
                await fetchPatientProfile(setPatientProfile);
                await fetchPatientType(userId, chatId, setPatientType);
                setIsFetchedPatientProfile(true);
            }
        };

        fetchProfile();
    }, [isFetchedPatientProfile]);


    useEffect(() => {
        const fetchSavedCCDResult = async () => {
            setIsLoading(true);
            const savedResult = await getCCDResult(userId, chatId);
            if (savedResult) {
                setSavedCCDResult(savedResult);
                setInputValues(prevValues => ({
                    ...prevValues,
                    ...savedResult,
                }));
                console.log("show previous ccdresult");
            }
            setIsLoading(false);
        };

        fetchSavedCCDResult();
    }, [userId, chatId]);


    useEffect(() => {
        const fetchProfile = async () => {
            if (!isFetchedPatientProfile) {
                await fetchPatientProfile(setPatientProfile);
                setIsFetchedPatientProfile(true);
            }
        };

        fetchProfile();
    }, [isFetchedPatientProfile]);


    useEffect(() => {
        // Check if ccdTruth already exists in KV database
        const fetchCCDTruth = async () => {
            const existingCCDTruth = await getCCDTruth(userId, chatId);
            console.log(userId, chatId);

            if (!existingCCDTruth) {
                // If ccdTruth is not in database, save ccdTruth according to current patientProfile
                const ccdTruth: CCDTruth = {
                    userId: userId,
                    chatId: chatId,
                    createdAt: new Date(),
                    relatedHistory: patientProfile?.history ?? '',
                    Helpless: patientProfile?.helpless_belief ?? [''],
                    Unlovable: patientProfile?.unlovable_belief ?? [''],
                    Worthless: patientProfile?.worthless_belief ?? [''],
                    intermediateBelief: patientProfile?.intermediate_belief ?? '',
                    intermediateBeliefDepression: patientProfile?.intermediate_belief_depression ?? '',
                    copingStrategies: patientProfile?.coping_strategies ?? '',
                    situation: patientProfile?.situation ?? '',
                    autoThought: patientProfile?.auto_thought ?? '',
                    Emotion: patientProfile?.emotion ?? [''],
                    behavior: patientProfile?.behavior ?? '',
                }
                await saveCCDTruth(ccdTruth);
                setSavedCCDTruth(ccdTruth);
                console.log('CCD truth saved successfully');
            } else {
                setSavedCCDTruth(existingCCDTruth);
                console.log('CCD truth already in KV database');
            }
        };

        fetchCCDTruth();
    }, [userId, chatId, patientProfile])

        // Render the modal into body using react-dom's createRoot when open.
    // We mount/unmount a small React tree so styling and interactions remain in React.
    useEffect(() => {
        if (!analysisModalOpen) return;

        const container = document.createElement('div');
        container.id = 'analysis-modal-root';
        document.body.appendChild(container);
        const root = createRoot(container);

        const ModalNode = (
            <div
                id="dummy-analysis-modal"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99,
                }}
            >
                <div
                    className="dummy-analysis-content"
                    style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 8,
                        maxWidth: '90%',
                        maxHeight: '80%',
                        overflow: 'auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{ margin: 0, marginBottom: 12 }}>Conversation Analysis</h2>
                    <div
                        className="dummy-analysis-result"
                        style={{ textAlign: 'left', whiteSpace: 'pre-wrap'}}
                    >
                        {/*
                          If callers set a React node via the provided API (resultContainer.render),
                          render that node. Otherwise fall back to the string content.
                        */}
                        {analysisModalNode ? (
                            // If the node is a plain string, render as text; otherwise render the node.
                            typeof analysisModalNode === 'string' ? (
                                <div>{analysisModalNode}</div>
                            ) : (
                                <>{analysisModalNode}</>
                            )
                        ) : (
                            // backward-compatible: show the string content
                            <div>{analysisModalContent}</div>
                        )}
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <button
                            onClick={() => setAnalysisModalOpen(false)}
                            style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#333', color: '#fff', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );

        root.render(ModalNode);

        return () => {
            root.unmount();
            if (container.parentNode) container.parentNode.removeChild(container);
        };
    }, [analysisModalOpen, analysisModalContent, analysisModalNode]);


    if (isLoading) {
        return <div>Loading patient mental state sidebar...</div>;  // or any loading indicator
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [name]: event.target.value,
        }));
        console.log(inputValues);
    };

    const handleCheckboxChange = (category: string, checkedValues: { id: string; label: string }[]) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [`checked${category}`]: checkedValues,
        }));
    };



    const createModal = () => {
        // Open modal with initial content
        setAnalysisModalContent('Analyzing conversation... please wait.');
        setAnalysisModalOpen(true);

        // Provide an object compatible with the existing usage:
        // code currently does: resultContainer.innerHTML = ... and resultContainer.innerText = ...
        const resultContainer: any = {};
        Object.defineProperty(resultContainer, 'innerHTML', {
            set: (val: string) => {
                // caller will normally pass escaped HTML (escapeHtml before assignment)
                // clear any previously-set React node
                setAnalysisModalNode(null);
                setAnalysisModalContent(val);
            },
        });
        Object.defineProperty(resultContainer, 'innerText', {
            set: (val: string) => {
                setAnalysisModalNode(null);
                setAnalysisModalContent(val);
            },
        });

        // New API: allow callers to render React nodes into the modal
        resultContainer.render = (node: React.ReactNode) => {
            setAnalysisModalContent('');
            setAnalysisModalNode(node);
        };

        // Return a simple modal handle (previous code expected an element, but we only need a close handle)
        const modal = {
            close: () => setAnalysisModalOpen(false),
        };

        return { modal, resultContainer };
    };



    const escapeHtml = (str: string) =>
        str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const handleSubmit = async () => {
        try {

            const ccdResult: CCDResult = {
                userId: userId,
                chatId: chatId,
                createdAt: new Date(),
                checkedHelpless: inputValues['checkedHelpless'] as [],
                checkedUnlovable: inputValues['checkedUnlovable'] as [],
                checkedWorthless: inputValues['checkedWorthless'] as [],
                intermediateBelief: inputValues['intermediateBelief'] as string,
                intermediateBeliefDepression: inputValues['intermediateBeliefDepression'] as string,
                copingStrategies: inputValues['copingStrategies'] as string,
                situation: inputValues['situation'] as string,
                autoThought: inputValues['autoThought'] as string,
                checkedEmotion: inputValues['checkedEmotion'] as [],
                behavior: inputValues['behavior'] as string,
            }
            await saveCCDResult(ccdResult);
            console.log('CCD results saved successfully');
            console.log(ccdResult);
            setIsSubmitted(true);

            const exportChatWithCCD = async () => {
                try {
                    // Fetch the chat data from the API
                    const response = await fetch(`/api/export-chat?userId=${userId}&chatId=${chatId}`);
                    const chatData = await response.json();

                    // Add CCD result and CCD truths to the chat data
                    const enrichedChatData = {
                        ...chatData,
                        ccdResult,
                        ccdTruth: savedCCDTruth,
                    };

                    // Create a blob with the enriched chat data
                    

                    setSummary(await getSummary(enrichedChatData) as string);

                    //enrichedChatData['summary'] = summary;
                    const blob = new Blob([JSON.stringify(enrichedChatData, null, 2)], { type: 'application/json' });

                    // Create a link element to trigger the download
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `chat_${userId}_${chatId}_export.json`;

                    // Append the link to the document, trigger the download, and remove the link
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    console.log('Chat data with CCD exported successfully');
                } catch (error) {
                    console.error('Error exporting chat data with CCD:', error);
                }
            };

            // Call the function to export the chat data
            exportChatWithCCD();

        } catch (error) {
            console.error('Error saving input values to KV database:', error);
        }
    };

    const getSummary = async (data: JSON) => {

        console.log("getSummary called with data:", data);

        const sum = await getChatSummary(chatId);
        if (false) { //sum
            return sum;
        } else {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({data})
            })
            /*if (!res.ok) {
                throw new Error('Failed to fetch summary from OpenAI');
            }*/
            const response = await res.json()
            setChatSummary(chatId, response.choices[0].message.content || response.output_text || response);
            return JSON.stringify(response.choices[0].message.content || response.output_text || response);
        }

    };

    const handleAnalysis = async() => {
        const response = await fetch(`/api/export-chat?userId=${userId}&chatId=${chatId}`);
        const data = await response.json();
        await getAnalysis(data);
    }

    const getAnalysis = async (data: JSON) => {

        const { modal, resultContainer } = createModal();

        try {
            //const response = await fetch(`/api/export-chat?userId=${userId}&chatId=${chatId}`);
            //const chatdata = await response.json();

            console.log("getAnalysis called with data:", data);

            const analysis = await getChatAnalysis(chatId);

            if (analysis) { // existing branch preserved
                createFeedbackScreen(resultContainer, analysis);
                return analysis;
            } else {
                const res = await fetch('/api/analysis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data })
                });

                const json = await res.json();
                const content = responseFormat(json);

                // display analysis in the modal
                createFeedbackScreen(resultContainer, content);

                // save into KV
                setChatAnalysis(chatId, content);
                return JSON.stringify(content);
            }
        } catch (error) {
            console.error('Error during analysis:', error);
            resultContainer.innerText = 'Error during analysis. Check console for details.';
            throw error;
        }

        // helper to extract text from OpenAI-like response
        function responseFormat(resp: any) {
            return resp?.choices?.[0]?.message?.content
                || resp?.output_text
                || JSON.stringify(resp, null, 2);
        }
    };

    const createFeedbackScreen = (resultContainer: any, analysis: string) => {

        //resultContainer.innerHTML = escapeHtml(analysis);

        resultContainer.render(<>
        <FeedbackScreen data={analysis} />
    </>);

    }

    const handleNewSession = async () => {
        const systemMsg = "Session ends. A week has passed, and the patient has had some time to work on what they learned in the last session. We are at the beginning of a new therapy session.";
        setMessages((currentMessages: any) => [
                                    ...currentMessages,
                                    {
                                        id: nanoid(),
                                        display: <SystemMessage>{systemMsg}</SystemMessage>
                                    }
                                ])
    }

    return (
        <div className="flex flex-col h-full">

            <div className="flex items-center justify-between p-4 px-5">
                <h4 className="text-lg font-bold">Patient Mental State and Feedback</h4>
            </div>
            <div className="mb-2 px-5 space-y-6 overflow-auto">
                <label className="block pt-1 leading-normal font-medium">
                    <span className="font-bold">Patient Type: {patientType}</span>
                </label>
                <div className='-mb-4'>
                    <label className="block text-base font-bold text-blue-600">{diagramTitleMapping["relatedHistory"]}:</label>
                </div>
                <p className="leading-normal font-medium text-blue-600">
                    {savedCCDTruth?.relatedHistory}
                </p>
                <label className="block pt-1 leading-normal font-medium text-red-500">
                    <span className="font-bold">The expected time of the session is around 10 minutes.</span>
                </label>
                <label className="block pt-1 leading-normal font-medium">
                    <span className="font-bold">Instructions: </span>{sessionInstructions["ccd-situation"]}
                </label>
                {diagramCCD.map(name => (
                    <div key={name}>
                        <label className="block text-base font-bold mb-1">{diagramTitleMapping[name]}</label>
                        <label className="block pt-1 text-sm font-medium leading-6 text-zinc-500">
                            {diagramDescriptionMapping[name]}
                        </label>
                        {name == "emotion" ? (
                            <div className="flex flex-col items-start space-y-2 mt-2">
                                {["Emotion"].map((category, index) => (
                                    <div className="flex flex-col items-start space-y-2 mt-2" key={category}>
                                        <CheckboxReactHookFormMultiple key={`${category}-${index}`} category={category} onCheckboxChange={handleCheckboxChange} checkboxValues={inputValues[`checked${category}`] as []} />
                                        {isSubmitted && <label className="block leading-normal font-medium text-blue-600">
                                            <span className="font-bold">Reference:</span>
                                            {
                                                savedCCDTruth?.['Emotion']?.map((item: string, index: number) => (
                                                    <div key={index} className="pt-1 leading-normal text-blue-600">
                                                        {item}
                                                    </div>
                                                )
                                                )}
                                        </label>}
                                    </div>))}

                            </div>
                        ) : (<div className="flex flex-col items-start space-y-2 mt-2">
                            <textarea
                                className="w-full h-[80px] px-3 py-2 text-sm leading-tight text-gray-700 dark:text-gray-200 border rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                                value={inputValues[name] as string} // Ensure fallback to prevent undefined value
                                onChange={(event) => handleChange(event, name)}
                            />

                            {isSubmitted && (
                                <label key={name} className="block pt-1 leading-normal font-medium text-blue-600">
                                    <span className="font-bold">Reference: </span>{savedCCDTruth?.[name]}
                                </label>
                            )}
                        </div>)}
                    </div>
                ))}
                {/*diagramRelated.map(name => (
                    <div key={name}>
                        <label className="block text-base font-bold mb-1">{diagramTitleMapping[name]}</label>
                        <label className="block pt-1 text-sm font-medium leading-6 text-zinc-500">
                            {diagramDescriptionMapping[name]}
                        </label>
                        {name == "coreBelief" ? (
                            <div className="mt-2">
                                {["Helpless", "Unlovable", "Worthless"].map((category, index) => (
                                    <div className="flex flex-col items-start space-y-2 mt-2" key={category}>
                                        <CheckboxReactHookFormMultiple key={`${category}-${index}`} category={category} onCheckboxChange={handleCheckboxChange} checkboxValues={inputValues[`checked${category}`] as []} />
                                        {isSubmitted && <label className="block leading-normal font-medium text-blue-600">
                                            <span className="font-bold">Reference:</span>
                                            {savedCCDTruth?.[category]?.length === 0 ? (
                                                <div className="pt-1 leading-normal text-blue-600">not chosen</div>
                                            ) : (
                                                savedCCDTruth?.[category]?.map((item: string, index: number) => (
                                                    <div key={index} className="pt-1 leading-normal text-blue-600">
                                                        {item}
                                                    </div>
                                                ))
                                            )}
                                        </label>}
                                    </div>)
                                )}
                            </div>
                        ) :
                            (<div className="flex flex-col items-start space-y-2 mt-2">
                                <textarea
                                    className="w-full h-[80px] px-3 py-2 text-sm leading-tight text-gray-700 dark:text-gray-200 border rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                                    value={inputValues[name] as string} // Ensure fallback to prevent undefined value
                                    onChange={(event) => handleChange(event, name)}
                                />

                                {isSubmitted && (
                                    <label key={name} className="block pt-1 leading-normal font-medium text-blue-600">
                                        <span className="font-bold">Reference: </span>{savedCCDTruth?.[name]}
                                    </label>
                                )}
                            </div>)

                        }
                    </div>
                ))*/}

            <div className="flex-col justify-end p-4 space-between-3">
                <div><button
                    className="text-sm mt-3 font-semiboldflex h-[35px] w-[220px] items-center justify-center rounded-md bg-black text-sm font-semibold text-white"
                    onClick={handleAnalysis}
                >
                    Conversation Analysis
                </button></div>

                <div><button
                    className="text-sm mt-3 font-semiboldflex h-[35px] w-[220px] items-center justify-center rounded-md bg-red-500 text-sm font-semibold text-white"
                    onClick={handleSubmit}
                >
                    Submit and get feedback
                </button></div>

                <div><button
                    className="text-sm mt-3 font-semiboldflex h-[35px] w-[220px] items-center justify-center rounded-md bg-green-500 text-sm font-semibold text-white"
                    onClick={handleNewSession}
                >
                    New session with patient
                </button></div>

                {<div><button
                    className="text-sm mt-3 font-semiboldflex h-[35px] w-[220px] items-center justify-center rounded-md bg-blue-500 text-sm font-semibold text-white mt-3"
                    onClick={() => setShowSummary(!showSummary)}
                >
                    Show Feedback
                </button></div>}

                {summary && showSummary && 
                
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h2 className="text-lg font-bold mb-2">Feedback</h2>
                    <p>{summary}</p>    
                </div>}
            </div>

            </div>
            
        </div>
    );
}

